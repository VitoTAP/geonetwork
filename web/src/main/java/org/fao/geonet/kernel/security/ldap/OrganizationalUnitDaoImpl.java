package org.fao.geonet.kernel.security.ldap;

import static org.springframework.ldap.query.LdapQueryBuilder.query;

import java.util.List;

import javax.naming.NamingException;
import javax.naming.directory.Attributes;
import javax.naming.ldap.LdapName;

import org.springframework.ldap.core.AttributesMapper;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.support.LdapNameBuilder;

public class OrganizationalUnitDaoImpl implements OrganizationalUnitDao {

	private LdapTemplate ldapTemplate;

    @Override
	public void create(OrganizationalUnit organizationalUnit) {
		ldapTemplate.create(organizationalUnit);
	}

    @Override
	public void update(OrganizationalUnit organizationalUnit) {
		ldapTemplate.update(organizationalUnit);
	}

    @Override
	public void delete(OrganizationalUnit organizationalUnit) {
		ldapTemplate.delete(ldapTemplate.findByDn(buildDn(organizationalUnit), OrganizationalUnit.class));
	}

    @Override
	public List<String> getAllOrganizationalUnitNames() {
        return ldapTemplate.search(query()
                .attributes("ou")
                .where("objectclass").is("organizationalUnit"),
                new AttributesMapper<String>() {
                    public String mapFromAttributes(Attributes attrs) throws NamingException {
                        return attrs.get("ou").get().toString();
                    }
                });
    }

    @Override
	public List<OrganizationalUnit> findAll() {
        return ldapTemplate.findAll(OrganizationalUnit.class);
	}

    @Override
	public OrganizationalUnit findByPrimaryKey(String organizationalUnitName) {
		LdapName dn = buildDn(organizationalUnitName);
		OrganizationalUnit organizationalUnit = ldapTemplate.findByDn(dn, OrganizationalUnit.class);

        return organizationalUnit;
	}

	private LdapName buildDn(OrganizationalUnit organizationalUnit) {
		return buildDn(organizationalUnit.getOrganizationalUnitName());
	}

	private LdapName buildDn(String organizationalUnitName) {
        return LdapNameBuilder.newInstance()
                .add("ou", organizationalUnitName)
                .build();
	}

	public void setLdapTemplate(LdapTemplate ldapTemplate) {
		this.ldapTemplate = ldapTemplate;
	}
}