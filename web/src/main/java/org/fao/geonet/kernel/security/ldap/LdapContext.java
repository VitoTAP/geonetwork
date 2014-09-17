package org.fao.geonet.kernel.security.ldap;

import java.util.Collections;

import javax.naming.Name;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.security.authentication.encoding.LdapShaPasswordEncoder;

public class LdapContext {
	private LdapTemplate ldapTemplate;
	private String defaultGroup;
	private String defaultProfile;

	private String uidAttribute;

	@Autowired
	private PersonDao personDao;

	@Autowired
	private GroupDao groupDao;

	public LdapContext() {
	}

	public LdapContext(PersonDao personDao, GroupDao groupDao) {
		this.personDao = personDao;
		this.groupDao = groupDao;
	}

	public void setLdapTemplate(LdapTemplate ldapTemplate) {
		this.ldapTemplate = ldapTemplate;
	}

	public String getDefaultGroup() {
		return defaultGroup;
	}

	public void setDefaultGroup(String defaultGroup) {
		this.defaultGroup = defaultGroup;
	}

	public String getDefaultProfile() {
		return defaultProfile;
	}

	public void setDefaultProfile(String defaultProfile) {
		this.defaultProfile = defaultProfile;
	}

	public void setUidAttribute(String uidAttribute) {
		this.uidAttribute = uidAttribute;
	}

	public boolean authenticate(String uid, String password) {
		return ldapTemplate.authenticate(((PersonDaoImpl)personDao).getBase(),uidAttribute + "=" + uid, password);
	}

	public void addPerson(Person person) {
		personDao.create(person);
	}

	public Person findPerson(String uid) {
		return personDao.findByPrimaryKey(uid);
	}
	
	public boolean changePassword(String uid, String password) {
		Person person = findPerson(uid);
		if (person!=null) {
			person.setPassword(password);
			updatePerson(person);
		}
		return true;
	}

	public void updatePerson(Person person) {
		personDao.update(person);
	}

	public void removePerson(Person person) {
		personDao.delete(person);
	}

	public void addGroup(Group group) {
		groupDao.create(group);
	}

	public void updateGroup(Group group) {
		groupDao.update(group);
	}

	public void addGroupMember(String commonName, Name member) {
		Group group = groupDao.findByPrimaryKey(commonName);
		if (group == null) {
			group = new Group();
			group.setCommonName(commonName);
			group.setMembers(Collections.<Name> emptySet());
			group.addMember(member);
			addGroup(group);
		} else {
			if (!group.getMembers().contains(member)) {
				group.addMember(member);
			}
			groupDao.update(group);
		}
	}

	public void removeGroupMember(String commonName, Name member) {
		Group group = groupDao.findByPrimaryKey(commonName);
		if (group != null) {
			if (group.getMembers().contains(member)) {
				group.removeMember(member);
				groupDao.update(group);
			}
		}
	}

	public void removeGroup(Group group) {
		groupDao.delete(group);
	}

/*	
	public String getShaPassword(String password) {
		LdapShaPasswordEncoder ldapShaPasswordEncoder = new LdapShaPasswordEncoder();
		ldapShaPasswordEncoder.setForceLowerCasePrefix(true);
		return ldapShaPasswordEncoder.encodePassword(password, null);
	}
*/
}