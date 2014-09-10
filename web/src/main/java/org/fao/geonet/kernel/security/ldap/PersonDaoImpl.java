package org.fao.geonet.kernel.security.ldap;

import static org.springframework.ldap.query.LdapQueryBuilder.query;

import java.util.List;

import javax.naming.NamingException;
import javax.naming.directory.Attributes;
import javax.naming.ldap.LdapName;

import org.springframework.ldap.core.AttributesMapper;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.support.LdapNameBuilder;

public class PersonDaoImpl implements PersonDao {

	private LdapTemplate ldapTemplate;

    @Override
	public void create(Person person) {
		ldapTemplate.create(person);
	}

    @Override
	public void update(Person person) {
		ldapTemplate.update(person);
	}

    @Override
	public void delete(Person person) {
		ldapTemplate.delete(ldapTemplate.findByDn(buildDn(person), Person.class));
	}

    @Override
	public List<String> getAllCommonNames() {
        return ldapTemplate.search(query()
                .attributes("cn")
                .where("objectclass").is("person"),
                new AttributesMapper<String>() {
                    public String mapFromAttributes(Attributes attrs) throws NamingException {
                        return attrs.get("cn").get().toString();
                    }
                });
    }

    @Override
	public List<Person> findAll() {
        return ldapTemplate.findAll(Person.class);
	}

    @Override
	public Person findByPrimaryKey(String commonName) {
		LdapName dn = buildDn(commonName);
        Person person = ldapTemplate.findByDn(dn, Person.class);

        return person;
	}

	private LdapName buildDn(Person person) {
		return buildDn(person.getCommonName());
	}

	private LdapName buildDn(String commonName) {
        return LdapNameBuilder.newInstance()
                .add("cn", commonName)
                .build();
	}

	public void setLdapTemplate(LdapTemplate ldapTemplate) {
		this.ldapTemplate = ldapTemplate;
	}
}