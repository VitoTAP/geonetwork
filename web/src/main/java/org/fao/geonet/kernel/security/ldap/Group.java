package org.fao.geonet.kernel.security.ldap;

import java.util.Set;

import javax.naming.Name;

import org.springframework.ldap.odm.annotations.Attribute;
import org.springframework.ldap.odm.annotations.DnAttribute;
import org.springframework.ldap.odm.annotations.Entry;
import org.springframework.ldap.odm.annotations.Id;

@Entry(objectClasses = { "top", "groupOfUniqueNames" })
public class Group {

	@Id
	private Name dn;

	@Attribute(name = "cn")
	private String commonName;

	@Attribute(name = "uniqueMember")
	private Set<Name> members;

	public Name getDn() {
		return dn;
	}

	public void setDn(Name dn) {
		this.dn = dn;
	}

	public Set<Name> getMembers() {
		return members;
	}

	public void setMembers(Set<Name> members) {
		this.members = members;
	}

	public String getCommonName() {
		return commonName;
	}

	public void setCommonName(String commonName) {
		this.commonName = commonName;
	}

	public void addMember(Name member) {
		members.add(member);
	}

	public void removeMember(Name member) {
		members.remove(member);
	}
}