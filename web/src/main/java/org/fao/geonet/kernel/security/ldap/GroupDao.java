package org.fao.geonet.kernel.security.ldap;

import java.util.List;

import javax.naming.ldap.LdapName;

public interface GroupDao {
	void create(Group group);

	void update(Group group);

	void delete(Group group);

	List<String> getAllGroupNames();

	List<String> getAllGroupNamesForMember(String uniqueMember);

	List<Group> findAll();

	Group findByPrimaryKey(String commonName);
}