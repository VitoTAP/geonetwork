package org.fao.geonet.kernel.security.ldap;

import java.util.List;

public interface OrganizationalUnitDao {
	void create(OrganizationalUnit organizationalUnit);

	void update(OrganizationalUnit organizationalUnit);

	void delete(OrganizationalUnit organizationalUnit);

	List<String> getAllOrganizationalUnitNames();

	List<OrganizationalUnit> findAll();

	OrganizationalUnit findByPrimaryKey(String organizationalUnitName);
}