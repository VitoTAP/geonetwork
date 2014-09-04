//=============================================================================
//===	Copyright (C) 2001-2007 Food and Agriculture Organization of the
//===	United Nations (FAO-UN), United Nations World Food Programme (WFP)
//===	and United Nations Environment Programme (UNEP)
//===
//===	This program is free software; you can redistribute it and/or modify
//===	it under the terms of the GNU General Public License as published by
//===	the Free Software Foundation; either version 2 of the License, or (at
//===	your option) any later version.
//===
//===	This program is distributed in the hope that it will be useful, but
//===	WITHOUT ANY WARRANTY; without even the implied warranty of
//===	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
//===	General Public License for more details.
//===
//===	You should have received a copy of the GNU General Public License
//===	along with this program; if not, write to the Free Software
//===	Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301, USA
//===
//===	Contact: Jeroen Ticheler - FAO - Viale delle Terme di Caracalla 2,
//===	Rome - Italy. email: geonetwork@osgeo.org
//==============================================================================

package org.fao.geonet.services.login;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

import javax.naming.NamingException;
import javax.naming.directory.DirContext;

import jeeves.utils.Log;

import org.apache.commons.lang.StringUtils;
import org.fao.geonet.constants.Geonet;
import org.fao.geonet.kernel.setting.SettingManager;

import com.ibm.icu.util.Calendar;

//=============================================================================

public class LDAPContext
{
	//--------------------------------------------------------------------------
	//---
	//--- Constructor
	//---
	//--------------------------------------------------------------------------

	public LDAPContext(SettingManager sm, String username, String password)
	{
		String prefix = "system/ldap";

		use           = sm.getValueAsBool(prefix +"/use");
		host          = sm.getValue      (prefix +"/host");
		port          = sm.getValueAsInt (prefix +"/port");
		this.username = username;
		this.password = password;
		defProfile    = sm.getValue      (prefix +"/defaultProfile");
        defGroup      = sm.getValue      (prefix +"/defaultGroup");
		baseDN        = sm.getValue      (prefix +"/distinguishedNames/base");
		usersDN       = sm.getValue      (prefix +"/distinguishedNames/users");
		groupsDN       = sm.getValue      (prefix +"/distinguishedNames/groups");
		nameAttr      = sm.getValue      (prefix +"/userAttribs/name");
		profileAttr   = sm.getValue      (prefix +"/userAttribs/profile");
		emailAttr     = "mail";  //TODO make it configurable
        uidAttr       = sm.getValue      (prefix +"/uidAttr");
        groupAttr     = sm.getValue      (prefix +"/userAttribs/group");
        groupNameAttr     = sm.getValue      (prefix +"/groupAttribs/name");
        memberAttr     = sm.getValue      (prefix +"/groupAttribs/member");

		if (profileAttr.trim().length() == 0)
			profileAttr = null;

        if (groupAttr.trim().length() == 0)
			groupAttr = null;
        
        if (memberAttr!=null && memberAttr.trim().length() == 0)
			memberAttr = null;

		//--- init set of allowed profiles

		profiles.add("Hoofdeditor");
		profiles.add("Editor");
		profiles.add("RegisteredUser");
		profiles.add("UserAdmin");
		profiles.add("Monitor");
		profiles.add("Administrator");
	}

	//--------------------------------------------------------------------------
	//---
	//--- API methods
	//---
	//--------------------------------------------------------------------------

	public String getUsersDN() {
		return usersDN;
	}

	public String getGroupsDN() {
		return groupsDN;
	}

	public String[] getUserObjectclass() {
		return userObjectclass;
	}

	public String getUidAttr() {
		return uidAttr;
	}

	public String getNameAttr() {
		return nameAttr;
	}

	public String[] getGroupObjectclass() {
		return groupObjectclass;
	}

	public String getGroupNameAttr() {
		return groupNameAttr;
	}

	public String getMemberAttr() {
		return memberAttr;
	}

	public boolean isInUse() { return use; }

	//--------------------------------------------------------------------------

	public LDAPInfo lookUp(String username, String password)
	{
		DirContext dc = null;
		try
		{
			String path = uidAttr + "="+ username +","+ usersDN +","+ baseDN;
			
			dc   = LDAPUtil.openContext(getUrl(), path, password);
			dc.close();

			dc   = LDAPUtil.openContext(getUrl(), this.username, this.password);
			String groupsPath = !StringUtils.isBlank(groupsDN) ? (groupsDN + "," + baseDN) : null;
			Map<String, ? extends List<Object>> attr = LDAPUtil.getNodeInfo(dc, path, groupAttr, groupsPath, groupNameAttr, memberAttr);

			if (attr == null)
			{
				Log.warning(Geonet.LDAP, "Username not found :'"+ username + "'");
				return null;
			}
			else
			{
				LDAPInfo info = new LDAPInfo();

				info.username = username;
				info.password = "" + Calendar.getInstance().getTimeInMillis();
				info.name     = get(attr, nameAttr);
				info.profile  = (profileAttr == null)
										? defProfile
										: get(attr, profileAttr);
				if (info.profile.equals("Reviewer")) {
					info.profile = "Hoofdeditor";
				}
				info.email = get(attr, emailAttr);

                info.groups = getAllGroups(attr, groupsPath!=null ? "groups" : groupAttr);


				if (!profiles.contains(info.profile))
				{
					Log.warning(Geonet.LDAP, "Skipping user with unknown profile");
					Log.warning(Geonet.LDAP, "  (C) Username :'"+ info.username + "'");
					Log.warning(Geonet.LDAP, "  (C) Profile  :'"+ info.profile + "'");
					return null;
				}

				return info;
			}
		}
		catch(NamingException e)
		{
			if (dc!=null) {
				try {
					dc.close();
				} catch (NamingException e1) {
					Log.warning(Geonet.LDAP, "Raised exception during LDAP close connection");
				}
			}
			Log.warning(Geonet.LDAP, "Raised exception during LDAP access");
			Log.warning(Geonet.LDAP, "  (C) Message :"+ e.getMessage());
			return null;
		}
	}

	public boolean updateGroups(String username, List<String> groups)
	{
		DirContext dc = null;
		try
		{
			dc   = LDAPUtil.openContext(getUrl(), this.username, this.password);
			return LDAPUtil.updateGroups(dc, username, !StringUtils.isBlank(usersDN) ? (usersDN + "," + baseDN) : null, uidAttr, groupAttr, !StringUtils.isBlank(groupsDN) ? (groupsDN + "," + baseDN) : null, groupNameAttr, memberAttr, groups);
		}
		catch(NamingException e)
		{
			if (dc!=null) {
				try {
					dc.close();
				} catch (NamingException e1) {
					Log.error(Geonet.LDAP, "Raised exception during LDAP close connection");
				}
			}
			Log.warning(Geonet.LDAP, "Raised exception during LDAP access");
			Log.warning(Geonet.LDAP, "  (C) Message :"+ e.getMessage());
		}
		return false;
	}

	//--------------------------------------------------------------------------
	//---
	//--- Private methods
	//---
	//--------------------------------------------------------------------------

	private String getUrl()
	{
		return "ldap://"+ host +":" + ((port != null) ? port : "389");
	}

	//--------------------------------------------------------------------------

	private String get(Map<String, ? extends List<Object>> attr, String name)
	{
		List<Object> values = attr.get(name);

		if (values == null)
		{
            if(Log.isDebugEnabled(Geonet.LDAP))
			Log.debug(Geonet.LDAP, "Attribute '"+ name +"' does not exist");
			return null;
		}

		Object obj = values.get(0);

		if (obj != null)
            if(Log.isDebugEnabled(Geonet.LDAP))
			Log.debug(Geonet.LDAP, "Attribute '"+ name +"' is of type : "+obj.getClass().getSimpleName());
		else
            if(Log.isDebugEnabled(Geonet.LDAP))
			Log.debug(Geonet.LDAP, "Attribute '"+ name +"' is null");

		return (obj == null) ? null : obj.toString();
	}

	private String[] getAllGroups(Map<String, ? extends List<Object>> attr, String name)
	{
		List<Object> values = attr.get(name);

		ArrayList<String> objs = new ArrayList<String>();
		
		if (values == null)
		{
            if(Log.isDebugEnabled(Geonet.LDAP))
			Log.debug(Geonet.LDAP, "Attribute '"+ name +"' does not exist");
			objs.add(defGroup);
		} else {
			for (Object obj: values) {
				if (obj != null) {
		            if(Log.isDebugEnabled(Geonet.LDAP)) {
		            	Log.debug(Geonet.LDAP, "Attribute '"+ name +"' is of type : "+obj.getClass().getSimpleName());
		            }
		            objs.add(obj.toString());
				} else {
		            if(Log.isDebugEnabled(Geonet.LDAP)) {
		            	Log.debug(Geonet.LDAP, "Attribute '"+ name +"' is null");
		            }
				}
			}
			if (!objs.contains(defGroup)) {
				objs.add(defGroup);
			}
		}
		return objs.toArray(new String[0]);
	}

	//--------------------------------------------------------------------------
	//---
	//--- Variables
	//---
	//--------------------------------------------------------------------------

	private boolean use;
	private String  host;
	private Integer port;
	private String username;
	private String password;
	private String  defProfile;
	private String  baseDN;
	private String  usersDN;
	private String  groupsDN;
    private String[]  userObjectclass = {"inetOrgPerson","top"};
	private String  nameAttr;
	private String  profileAttr;
	private String  emailAttr;
    private String  uidAttr;
    private String[]  groupObjectclass = {"organizationalUnit","top"};
    private String  groupAttr;
    private String  groupNameAttr;
    private String  memberAttr;
    private String  defGroup;


	private HashSet<String> profiles = new HashSet<String>();
}

//=============================================================================

class LDAPInfo
{
	public String username;
	public String password;
	public String profile;
	public String name;
	public String email;
    public String[] groups;
}

//=============================================================================

