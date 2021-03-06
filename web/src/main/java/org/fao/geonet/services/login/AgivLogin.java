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
import java.util.Map;

import jeeves.exceptions.MissingParameterEx;
import jeeves.exceptions.UserLoginEx;
import jeeves.interfaces.Service;
import jeeves.resources.dbms.Dbms;
import jeeves.server.ServiceConfig;
import jeeves.server.UserSession;
import jeeves.server.context.ServiceContext;
import jeeves.utils.Util;

import org.apache.commons.lang.StringUtils;
import org.fao.geonet.GeonetContext;
import org.fao.geonet.constants.Geonet;
import org.fao.geonet.constants.Params;
import org.fao.geonet.kernel.setting.SettingManager;
import org.fao.geonet.lib.Lib;
import org.fao.geonet.util.IDFactory;
import org.jdom.Element;

//=============================================================================

/** Try to login a user, based on Fediz
  */

public class AgivLogin implements Service
{
	private String defaultPassword = "agiv"; 
	//--------------------------------------------------------------------------
	//---
	//--- Init
	//---
	//--------------------------------------------------------------------------

	public void init(String appPath, ServiceConfig params) throws Exception {}

	//--------------------------------------------------------------------------
	//---
	//--- Service
	//---
	//--------------------------------------------------------------------------
	public Element exec(Element params, ServiceContext context) throws Exception
	{
		GeonetContext  gc = (GeonetContext) context.getHandlerContext(Geonet.CONTEXT_NAME);
		SettingManager sm = gc.getSettingManager();

		Dbms dbms = (Dbms) context.getResourceManager().open(Geonet.Res.MAIN_DB);

		updateNewGroups(dbms);
		UserSession userSession = context.getUserSession();
		if (StringUtils.isBlank(userSession.getUsername())) {
			throw new MissingParameterEx(Params.USERNAME);
		}
		defaultPassword = "!" + userSession.getUsername() + "!";
		String username = userSession.getUsername();
	    String userinfo = "false";

		Element user = null;
		List list = null;
		if ("Administrator".equals(userSession.getProfile()) && userSession.getUsername().equals("admin"))
		{
			list = dbms.select("SELECT * FROM Users WHERE id = '1'").getChildren();
			user = (Element) list.get(0);
		}
		else
		{
			updateUser(context, dbms);
			String query = "SELECT * FROM Users WHERE username = ? AND password = ?";
			list = dbms.select(query, username, Util.scramble(defaultPassword)).getChildren();
			if (list.size() == 0) {
				// Check old password hash method
				list = dbms.select(query, username, Util.oldScramble(defaultPassword)).getChildren();

				if (list.size() == 0)
					throw new UserLoginEx(username);
				else
					context.info("User '" + username + "' logged in using an old scrambled password.");
			}
			user = (Element) list.get(0);
		}

		//--- attempt to load user from db

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
     * @param info
     * @throws SQLException
     * @throws UserLoginEx 
     */
	@SuppressWarnings("unchecked")
	private void updateUser(ServiceContext context, Dbms dbms) throws SQLException, UserLoginEx {
		List<Map<String,String>> groups = (List<Map<String,String>>) context.getUserSession().getProperty("groups");
        String id = "-1";
        String userId = "-1";

        List<String> groupIds = new ArrayList<String>();
        //--- Create group retrieved from LDAP if it's new
        if (groups != null) {
        	for (Map<String,String> group : groups) {
                String query = "SELECT id FROM Groups WHERE name=?";
                List list  = dbms.select(query, group.get("name")).getChildren();

                if (list.isEmpty()) {
                    id = IDFactory.newID();
    			    query = "INSERT INTO GROUPS(id, name, description) VALUES(?,?,?)";
                    dbms.execute(query, id, group.get("name"),group.get("description"));
                    Lib.local.insert(dbms, "Groups", id, group.get("description"));
                } else {
                    id = ((Element) list.get(0)).getChildText("id");
                }
                groupIds.add(id);
        	}
        }

		//--- update user information into the database

		String query = "UPDATE Users SET password=?, surname=?, name=?, profile=?, email=? WHERE username=?";

		int res = dbms.execute(query, Util.scramble256(defaultPassword), context.getUserSession().getSurname(), context.getUserSession().getName(), context.getUserSession().getProfile(), context.getUserSession().getEmailAddr(), context.getUserSession().getUsername());

		//--- if the user was not found --> add it

		if (res == 0)
		{
			userId = IDFactory.newID();
			query = "INSERT INTO Users(id, username, password, surname, name, profile, email) VALUES(?,?,?,?,?,?,?)";

			dbms.execute(query, userId, context.getUserSession().getUsername(), Util.scramble(defaultPassword), context.getUserSession().getSurname(), context.getUserSession().getName(), context.getUserSession().getProfile(), context.getUserSession().getEmailAddr());
		} else {
			query = "SELECT id FROM Users WHERE username=?";
            List list  = dbms.select(query, context.getUserSession().getUsername()).getChildren();
            userId = ((Element) list.get(0)).getChildText("id");			
		}

		if (StringUtils.isBlank(userId)) {
			throw new UserLoginEx(userId);
		}
    	query = "DELETE FROM UserGroups WHERE userId=?";

		dbms.execute(query, userId);

        //--- Associate user and group retrieved from LDAP
    	for (String groupId : groupIds) {
            query = "INSERT INTO UserGroups(userId, groupId) VALUES(?,?)";
            dbms.execute(query, userId, groupId);
    	}

		dbms.commit();
	}

	/**
    *
    * @param context
    * @param dbms
    * @param info
    * @throws SQLException
    * @throws UserLoginEx 
    */
	@SuppressWarnings("unchecked")
	private void updateNewGroups(Dbms dbms) throws SQLException, UserLoginEx {
       String selectQuery = "SELECT * FROM GroupsToCreate";
	   String insertQuery = "INSERT INTO GROUPS(id, name, description) VALUES(?,?,?)";
	   String deleteQuery = "DELETE FROM GroupsToCreate WHERE name=?";
       List<Element> groupsToCreateList  = dbms.select(selectQuery).getChildren();
	   for(Element groupToCreate : groupsToCreateList) {
           String queryExistingGroup = "SELECT id FROM Groups WHERE name=?";
           String name = groupToCreate.getChildText("name");
           List<Element> listExistingGroups  = dbms.select(queryExistingGroup, name).getChildren();

           if (listExistingGroups.isEmpty()) {
        	   String id = IDFactory.newID();
        	   String groupDescription = groupToCreate.getChildText("description");
        	   if (groupDescription!=null) {
            	   dbms.execute(insertQuery, id, name, groupDescription);
            	   Lib.local.insert(dbms, "Groups", id, groupDescription);
            	   dbms.execute(deleteQuery, name);
        	   }
           }
	   }
       dbms.commit();
	}
}