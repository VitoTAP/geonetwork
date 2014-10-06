package org.fao.geonet.kernel.security.ldap;

import java.util.List;

import javax.naming.ldap.LdapName;

public interface PersonDao {
	void create(Person person);

	void update(Person person);

	void delete(Person person);

	List<String> getAllCommonNames();

	List<Person> findAll();

	Person findByPrimaryKey(String uid);

	LdapName buildDn(String uid);
}