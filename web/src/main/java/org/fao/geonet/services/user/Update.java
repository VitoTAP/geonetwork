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

package org.fao.geonet.services.user;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import jeeves.constants.Jeeves;
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
import org.fao.geonet.kernel.security.ldap.Person;
import org.fao.geonet.kernel.setting.SettingManager;
import org.fao.geonet.services.login.LDAPContext;
import org.fao.geonet.util.IDFactory;
import org.jdom.Element;

//=============================================================================

/** Update the information of a user
  */

public class Update implements Service
{
	private String ldapUsername;
	private String ldapPassword;
	//--------------------------------------------------------------------------
	//---
	//--- Init
	//---
	//--------------------------------------------------------------------------

	public void init(String appPath, ServiceConfig params) throws Exception {
		ldapUsername = params.getValue("ldapUsername", "cn=reader,ou=ldap_accounts,ou=pdf,dc=eodata,dc=vito,dc=be");
		ldapPassword = params.getValue("ldapPassword", "reader");		
	}

	//--------------------------------------------------------------------------
	//---
	//--- Service
	//---
	//--------------------------------------------------------------------------

	public Element exec(Element params, ServiceContext context) throws Exception
	{
		String operation = Util.getParam(params, Params.OPERATION);
		String id       = params.getChildText(Params.ID);
		String username = Util.getParam(params, Params.USERNAME);
		String password = Util.getParam(params, Params.PASSWORD);
		String surname  = Util.getParam(params, Params.SURNAME, "");
		String name     = Util.getParam(params, Params.NAME,    "");
		String profile  = Util.getParam(params, Params.PROFILE);
		String address  = Util.getParam(params, Params.ADDRESS, "");
		String city     = Util.getParam(params, Params.CITY,    "");
		String state    = Util.getParam(params, Params.STATE,   "");
		String zip      = Util.getParam(params, Params.ZIP,     "");
		String country  = Util.getParam(params, Params.COUNTRY, "");
		String email    = Util.getParam(params, Params.EMAIL,   "");
		String organ    = Util.getParam(params, Params.ORG,     "");
		String kind     = Util.getParam(params, Params.KIND,    "");

		UserSession usrSess = context.getUserSession();
		String      myProfile = usrSess.getProfile();
		String      myUserId  = usrSess.getUserId();
		java.util.List<Element> userGroups = params.getChildren(Params.GROUPS);

		if (!operation.equals(Params.Operation.RESETPW)) {
			if (!context.getProfileManager().exists(profile))
				throw new Exception("Unknown profile : "+ profile);

			if (profile.equals(Geonet.Profile.ADMINISTRATOR))
				userGroups = new ArrayList<Element>();
		}

		if (myProfile.equals(Geonet.Profile.ADMINISTRATOR) ||
				myProfile.equals("UserAdmin") ||
				myUserId.equals(id)) {

			GeonetContext  gc = (GeonetContext) context.getHandlerContext(Geonet.CONTEXT_NAME);
			SettingManager sm = gc.getSettingManager();
			Dbms dbms = (Dbms) context.getResourceManager().open (Geonet.Res.MAIN_DB);


			LDAPContext lc = new LDAPContext(sm, ldapUsername, ldapPassword);
			boolean bUpdatePassword = false;
			boolean bAddLDAPUser = false;
			boolean bUpdateLDAPUser = false;
			boolean bUpdateLDAPGroups = false;
			java.util.List<String> groupsToAddToLdap = new ArrayList<String>();
			// Before we do anything check (for UserAdmin) that they are not trying
			// to add a user to any group outside of their own - if they are then
			// raise an exception - this shouldn't happen unless someone has
			// constructed their own malicious URL!
			//
			if (operation.equals(Params.Operation.NEWUSER) || operation.equals(Params.Operation.EDITINFO)) {
				if (!(myUserId.equals(id)) && myProfile.equals("UserAdmin")) {
					Element grps = dbms.select("SELECT groupId from UserGroups WHERE userId=?", myUserId);
					java.util.List<Element> myGroups = grps.getChildren();
					for(Element userGroup : userGroups) {
						String group = userGroup.getText();
						boolean found = false;
						for (Element myGroup : myGroups) {
							if (group.equals(myGroup.getChild("groupid").getText())) {
								found = true;
							}
						}
						if (!found) {
							throw new IllegalArgumentException("tried to add group id "+group+" to user "+username+" - not allowed because you are not a member of that group!");	
						}
					}
				}
			}

		// -- For adding new user
			if (operation.equals(Params.Operation.NEWUSER)) {

				// check if the new username already exists - if so then don't do this
				String query= "SELECT * FROM Users WHERE username=?";
				Element usersTest = dbms.select(query, username);
				if (usersTest.getChildren().size() != 0) throw new IllegalArgumentException("User with username "+username+" already exists");

				id = IDFactory.newID();

				query = "INSERT INTO Users (id, username, password, surname, name, profile, "+
							"address, city, state, zip, country, email, organisation, kind) "+
							"VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

				dbms.execute(query, id, username, Util.scramble256(password), surname, name, profile, address, city, state,
                        zip, country, email, organ, kind);
			//--- add groups
				for(Element userGroup : userGroups) {
					String group = userGroup.getText();
					if (!isAdmin(dbms, username) && lc.isInUse())
					{
						//groupsToAddToLdap.add(group);
					}
					addGroup(dbms, id, group);
				}
				bAddLDAPUser = true;
				bUpdateLDAPGroups = true;
			}

			else {

			// -- full update
				if (operation.equals(Params.Operation.FULLUPDATE)) {
					String query = "UPDATE Users SET username=?, password=?, surname=?, name=?, profile=?, address=?, city=?, state=?, zip=?, country=?, email=?, organisation=?, kind=? WHERE id=?";

					dbms.execute (query, username, Util.scramble256(password), surname, name, profile, address, city,
                            state, zip, country, email, organ, kind, id);

					//--- add groups

					dbms.execute("DELETE FROM UserGroups WHERE userId=?", id);

					for(Element userGroup : userGroups) {
						String group = userGroup.getText();
						if (!isAdmin(dbms, username) && lc.isInUse())
						{
							groupsToAddToLdap.add(group);
						}
						addGroup(dbms, id, group);
					}
					bUpdateLDAPUser = true;
					bUpdatePassword = true;
					bUpdateLDAPGroups = true;

			// -- edit user info
				} else if (operation.equals(Params.Operation.EDITINFO)) {
					String query = "UPDATE Users SET username=?, surname=?, name=?, profile=?, address=?, city=?, state=?, zip=?, country=?, email=?, organisation=?, kind=? WHERE id=?";
					dbms.execute (query, username, surname, name, profile, address, city, state, zip, country, email, organ, kind, id);
					//--- add groups
				
					dbms.execute ("DELETE FROM UserGroups WHERE userId=?", id);
					for(Element userGroup : userGroups) {
						String group = userGroup.getText();
						if (!isAdmin(dbms, username) && lc.isInUse())
						{
							groupsToAddToLdap.add(group);
						}
						addGroup(dbms, id, group);
					}
					bUpdateLDAPUser = true;
					bUpdateLDAPGroups = true;
			// -- reset password
				}
                else if (operation.equals(Params.Operation.RESETPW)) {
					String query = "UPDATE Users SET password=? WHERE id=?";
					dbms.execute (query, Util.scramble256(password), id);
				}
                else {
					throw new IllegalArgumentException("unknown user update operation "+operation);
				}
			} 
			if (!isAdmin(dbms, username) && lc.isInUse()) {
				if (bAddLDAPUser || bUpdateLDAPUser) {
					Person person = new Person();
					person.setUid(username);
					person.setCommonName(name);
					person.setSurname(surname);
					if (bUpdatePassword) {
						person.setPassword(gc.getLdapContext().getShaPassword(password));
					}
					if (!StringUtils.isBlank(address)) {
						person.setPostalAddress(address);
					}
					if (!StringUtils.isBlank(zip)) {
						person.setPostalCode(zip);
					}
					if (!StringUtils.isBlank(city)) {
						person.setCommune(city);
					}
					person.setMail(email);
					person.setCompany(organ);
					person.setBusinessCategory(kind);
					person.setCountry(country);
					if (bAddLDAPUser) {
						gc.getLdapContext().addPerson(person);
					}
					if (bUpdateLDAPUser) {
						gc.getLdapContext().updatePerson(person);					
					}
				}
				if (bUpdateLDAPGroups) {
//					lc.updateGroups(username,groupsToAddToLdap);
				}
			}
		} else {
			throw new IllegalArgumentException("you don't have rights to do this");
		}

		return new Element(Jeeves.Elem.RESPONSE);
	}

	//--------------------------------------------------------------------------
	//---
	//--- Private methods
	//---
	//--------------------------------------------------------------------------

	/** Adds a user to a group
	  */

	public static void addGroup(Dbms dbms, String user, String group) throws Exception {
		dbms.execute("INSERT INTO UserGroups(userId, groupId) VALUES (?, ?)", user, group);
	}

	private boolean isAdmin(Dbms dbms, String username) throws SQLException
	{
		String query = "SELECT id FROM Users WHERE username=? AND profile=?";

		List list = dbms.select(query, username, "Administrator").getChildren();

		return (list.size() != 0);
	}

}