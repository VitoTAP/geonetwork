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

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import jeeves.exceptions.UserLoginEx;
import jeeves.interfaces.Service;
import jeeves.resources.dbms.Dbms;
import jeeves.server.ServiceConfig;
import jeeves.server.context.ServiceContext;
import jeeves.utils.Util;

import org.apache.commons.lang.StringUtils;
import org.fao.geonet.GeonetContext;
import org.fao.geonet.constants.Geonet;
import org.fao.geonet.constants.Params;
import org.fao.geonet.kernel.security.ldap.LdapContext;
import org.fao.geonet.kernel.security.ldap.Person;
import org.fao.geonet.kernel.setting.SettingManager;
import org.fao.geonet.lib.Lib;
import org.fao.geonet.util.IDFactory;
import org.jdom.Element;

//=============================================================================

/** Try to login a user, checking the username and password
  */

public class Login implements Service
{
	//--------------------------------------------------------------------------
	//---
	//--- Init
	//---
	//--------------------------------------------------------------------------

	public void init(String appPath, ServiceConfig params) throws Exception {
	}

	//--------------------------------------------------------------------------
	//---
	//--- Service
	//---
	//--------------------------------------------------------------------------
	public Element exec(Element params, ServiceContext context) throws Exception
	{
		String username = Util.getParam(params, Params.USERNAME);
		String password = Util.getParam(params, Params.PASSWORD);
	    String userinfo = Util.getParam(params, Params.INFO, "false");

		GeonetContext  gc = (GeonetContext) context.getHandlerContext(Geonet.CONTEXT_NAME);
		SettingManager sm = gc.getSettingManager();

		Dbms dbms = (Dbms) context.getResourceManager().open(Geonet.Res.MAIN_DB);

		if (!isAdmin(dbms, username) && sm.getValueAsBool("system/ldap/use"))
		{
			LdapContext ldapContext = gc.getLdapContext();
			if (ldapContext.authenticate(username, /*ldapContext.getShaPassword(password)*/password)) {
				Person person = ldapContext.findPerson(username);
				if (person!=null) {
					updateUser(context, dbms, person, password, ldapContext.getDefaultProfile());
					List<String> groupNames = ldapContext.getGroupsByMember(username);
					updateUserGroups(context, dbms, person, groupNames);
				}
			} else {
				throw new UserLoginEx(username);				
			}
		}

		//--- attempt to load user from db

		String query = "SELECT * FROM Users WHERE username = ? AND password = ?";
	
		List list = dbms.select(query, username, Util.scramble256(password)).getChildren();
		if (list.size() == 0) {
			// Check old password hash method
			list = dbms.select(query, username, Util.oldScramble(password)).getChildren();

			if (list.size() == 0)
				throw new UserLoginEx(username);
			else
				context.info("User '" + username + "' logged in using an old scrambled password.");
		}
		Element user = (Element) list.get(0);

		String sId        = user.getChildText(Geonet.Elem.ID);
		String sName      = user.getChildText(Geonet.Elem.NAME);
		String sSurname   = user.getChildText(Geonet.Elem.SURNAME);
		String sProfile   = user.getChildText(Geonet.Elem.PROFILE);
		String sEmailAddr = user.getChildText(Geonet.Elem.EMAIL);

		context.info("User '"+ username +"' logged in as '"+ sProfile +"'");
		context.getUserSession().authenticate(sId, username, sName, sSurname, sProfile, sEmailAddr);
		
		if ("false".equals(userinfo)) {
		    return new Element("ok");
		} else {
    		user.removeChildren("password");
    		return new Element("ok")
    		    .addContent(user.detach());
		}
	}

	//--------------------------------------------------------------------------

	private boolean isAdmin(Dbms dbms, String username) throws SQLException
	{
		String query = "SELECT id FROM Users WHERE username=? AND profile=?";

		List list = dbms.select(query, username, "Administrator").getChildren();

		return (list.size() != 0);
	}

    /**
     *
     * @param context
     * @param dbms
     * @param person
     * @param password
     * @param defaultProfile
     * @throws SQLException
     * @throws UserLoginEx 
     */
	private void updateUser(ServiceContext context, Dbms dbms, Person person, String password, String defaultProfile) throws SQLException, UserLoginEx {
        String userId = "-1";
		String query = "UPDATE Users SET password=?, name=? WHERE username=?";

		int res = dbms.execute(query, Util.scramble256(password), person.getCommonName(), person.getUid());

		if (res == 0)
		{
			userId = IDFactory.newID();
			query = "INSERT INTO Users(id, username, password, surname, name, profile) VALUES(?,?,?,?,?,?)";

			dbms.execute(query, userId, person.getUid(), Util.scramble256(password), person.getSurname(), person.getCommonName(), defaultProfile);
		} else {
			query = "SELECT id FROM Users WHERE username=?";
            List list  = dbms.select(query, person.getUid()).getChildren();
            userId = ((Element) list.get(0)).getChildText("id");			
		}

		if (StringUtils.isBlank(userId)) {
			throw new UserLoginEx(userId);
		}
        dbms.commit();
	}

	private void updateUserGroups(ServiceContext context, Dbms dbms, Person person, List<String> groupNames) throws SQLException, UserLoginEx {
        ArrayList<String> groupIds = new ArrayList<String>();
    	String groupId;
    	for (String group: groupNames) {
            String query = "SELECT id FROM Groups WHERE name=?";
            List list  = dbms.select(query, group).getChildren();

            if (list.isEmpty()) {
                groupId = IDFactory.newID();
			    query = "INSERT INTO GROUPS(id, name) VALUES(?,?)";
                dbms.execute(query, groupId, group);
                Lib.local.insert(dbms, "Groups", groupId, group);
            } else {
                groupId = ((Element) list.get(0)).getChildText("id");
            }
            groupIds.add(groupId);
    	}
    	if (groupIds.size()>0) {
    		String query = "SELECT id FROM Users WHERE username=?";
            List list  = dbms.select(query, person.getUid()).getChildren();
            String userId = ((Element) list.get(0)).getChildText("id");			
    		if (StringUtils.isBlank(userId)) {
    			throw new UserLoginEx(userId);
    		}
    		query = "DELETE FROM UserGroups WHERE userId=?";
    	
    		dbms.execute(query, userId);
    	
	    	for (String geonetworkGroupId: groupIds) {
	    		query = "INSERT INTO UserGroups(userId, groupId) VALUES(?,?)";
	    		dbms.execute(query, userId, geonetworkGroupId);
	    	}

	    	dbms.commit();
    	}
	}
}