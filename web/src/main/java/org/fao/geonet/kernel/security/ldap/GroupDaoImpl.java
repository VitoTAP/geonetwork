package org.fao.geonet.kernel.security.ldap;

import static org.springframework.ldap.query.LdapQueryBuilder.query;

import java.util.List;

import javax.naming.NamingException;
import javax.naming.directory.Attributes;
import javax.naming.ldap.LdapName;

import org.springframework.ldap.core.AttributesMapper;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.support.LdapNameBuilder;

public class GroupDaoImpl implements GroupDao {

	private LdapTemplate ldapTemplate;

	private String base;

	public String getBase() {
		return base;
	}

	public void setBase(String base) {
		this.base = base;
	}

    @Override
	public void create(Group group) {
		ldapTemplate.create(group);
	}

    @Override
	public void update(Group group) {
		ldapTemplate.update(group);
	}

    @Override
	public void delete(Group group) {
		ldapTemplate.delete(ldapTemplate.findByDn(buildDn(group), Group.class));
	}

    @Override
	public List<String> getAllGroupNames() {
        return ldapTemplate.search(query()
                .attributes("cn")
                .where("objectclass").is("groupOfUniqueNames"),
                new AttributesMapper<String>() {
                    public String mapFromAttributes(Attributes attrs) throws NamingException {
                        return attrs.get("cn").get().toString();
                    }
                });
    }

    @Override
	public List<String> getAllGroupNamesForMember(String uniqueMember) {
        return ldapTemplate.search(query()
                .attributes("cn")
                .where("objectclass").is("groupOfUniqueNames").and("uniqueMember").is(uniqueMember),
                new AttributesMapper<String>() {
                    public String mapFromAttributes(Attributes attrs) throws NamingException {
                        return attrs.get("cn").get().toString();
                    }
                });
    }

    @Override
	public List<Group> findAll() {
        return ldapTemplate.findAll(Group.class);
	}

    @Override
	public Group findByPrimaryKey(String commonName) {
		LdapName dn = buildDn(commonName);
		Group group = ldapTemplate.findByDn(dn, Group.class);

        return group;
	}

	private LdapName buildDn(Group group) {
		return buildDn(group.getCommonName());
	}

	private LdapName buildDn(String commonName) {
        return LdapNameBuilder.newInstance(base)
                .add("cn", commonName)
                .build();
	}

	public void setLdapTemplate(LdapTemplate ldapTemplate) {
		this.ldapTemplate = ldapTemplate;
	}
}