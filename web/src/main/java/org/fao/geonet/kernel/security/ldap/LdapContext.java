package org.fao.geonet.kernel.security.ldap;

import java.security.MessageDigest;
import java.util.Collections;

import javax.naming.Name;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.query.LdapQueryBuilder;
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

	public void setDefaultGroup(String defaultGroup) {
		this.defaultGroup = defaultGroup;
	}

	public void setDefaultProfile(String defaultProfile) {
		this.defaultProfile = defaultProfile;
	}

	public void setUidAttribute(String uidAttribute) {
		this.uidAttribute = uidAttribute;
	}

	public void authenticate(String uid, String password) {
		ldapTemplate.authenticate(LdapQueryBuilder.query().where(uidAttribute).is(uid), getShaPassword(password));
	}

	public void addPerson(Person person) {
		personDao.create(person);
	}

	public void updatePerson(Person p) {
		Person person = personDao.findByPrimaryKey(p.getCommonName());
		person.setCompany(person.getCompany());
		person.setCountry(person.getCountry());
		person.setDescription(person.getDescription());
		person.setDn(person.getDn());
		person.setSurname(person.getSurname());
		person.setPhone(person.getPhone());
		personDao.update(person);
	}

	public void removePerson(Person person) {
		personDao.delete(person);
	}

	public void addGroup(Group group) {
		groupDao.create(group);
	}

	public void updateGroup(Group g) {
		Group group = groupDao.findByPrimaryKey(g.getCommonName());
		group.setMembers(group.getMembers());
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
	
	public String getShaPassword(String password) {
		  LdapShaPasswordEncoder  ldapShaPasswordEncoder  = new LdapShaPasswordEncoder();
		  String result = ldapShaPasswordEncoder.encodePassword(password,null);
		  System.out.println("userpassword in LDAP:" + result);
		  return result;
	}
}