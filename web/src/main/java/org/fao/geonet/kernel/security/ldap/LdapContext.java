package org.fao.geonet.kernel.security.ldap;

import java.util.Collections;
import java.util.List;

import javax.naming.Name;
import javax.naming.ldap.LdapName;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.core.support.BaseLdapNameAware;
import org.springframework.ldap.support.LdapNameBuilder;
import org.springframework.security.authentication.encoding.LdapShaPasswordEncoder;

public class LdapContext implements BaseLdapNameAware {
	private LdapTemplate ldapTemplate;
	private String defaultGroup;
	private String defaultProfile;

	private String uidAttribute;

	@Autowired
	private PersonDao personDao;

	@Autowired
	private GroupDao groupDao;

	private LdapName baseLdapPath;

	public void setBaseLdapPath(LdapName baseLdapPath) {
		this.baseLdapPath = baseLdapPath;
	}

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
		return ldapTemplate.authenticate(((PersonDaoImpl) personDao).getBase(),
				uidAttribute + "=" + uid, password);
	}

	public void addPerson(Person person) {
		personDao.create(person);
	}

	public Person findPerson(String uid) {
		return personDao.findByPrimaryKey(uid);
	}

	public boolean changePassword(String uid, String password) {
		Person person = findPerson(uid);
		if (person != null) {
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

	public List<String> getGroupsByMember(String uid) {
		return groupDao.getAllGroupNamesForMember(getFullPersonDn(uid).toString());
	}

	public void addGroup(Group group) {
		groupDao.create(group);
	}

	public void updateGroup(Group group) {
		groupDao.update(group);
	}

	public void addGroupMember(String commonName, String uid) {
		Group group = groupDao.findByPrimaryKey(commonName);
		Name member = getFullPersonDn(uid);
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

	public void removeGroupMember(String commonName, String uid) {
		Group group = groupDao.findByPrimaryKey(commonName);
		Name member = getFullPersonDn(uid);
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

	public String getShaPassword(String password) {
		/*
		 * ShaPasswordEncoder shaPasswordEncoder = new ShaPasswordEncoder(256);
		 * String shaPassword = shaPasswordEncoder.encodePassword(password,
		 * null); return shaPassword;
		 */
		LdapShaPasswordEncoder ldapShaPasswordEncoder = new LdapShaPasswordEncoder();
		ldapShaPasswordEncoder.setForceLowerCasePrefix(true);
		return ldapShaPasswordEncoder.encodePassword(password, null);
	}

	public String getShaPasswordFromAsciiValues(String asciiPassword) {
		String[] passwordAsciiArray = asciiPassword.split(",");
		StringBuffer sb = new StringBuffer();
		for (String asciiValue : passwordAsciiArray) {
			sb.append((char) Integer.parseInt(asciiValue));
		}
		return sb.toString();
	}

	private LdapName getFullPersonDn(String uid) {
		return LdapNameBuilder.newInstance(baseLdapPath).add(personDao
				.buildDn(uid))
				.build();
	}
}