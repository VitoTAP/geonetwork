package org.fao.geonet.kernel.security.ldap;

import java.util.List;

public interface GroupDao {
	void create(Group group);

	void update(Group group);

	void delete(Group group);

	List<String> getAllGroupNames();

	List<Group> findAll();

	Group findByPrimaryKey(String commonName);
}