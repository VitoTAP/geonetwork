package org.fao.geonet.kernel.security.ldap;

import javax.naming.Name;

import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;
import org.springframework.ldap.odm.annotations.Attribute;
import org.springframework.ldap.odm.annotations.DnAttribute;
import org.springframework.ldap.odm.annotations.Entry;
import org.springframework.ldap.odm.annotations.Id;

@Entry(objectClasses = { "organizationalUnit", "top" })
public class OrganizationalUnit {
	@Id
	private Name dn;
	
	@Attribute(name = "ou")
	@DnAttribute(value = "ou", index = 0)
	private String organizationalUnitName;

	@Attribute(name = "description")
	private String description;

	public Name getDn() {
		return dn;
	}

	public void setDn(Name dn) {
		this.dn = dn;
	}

	public String getOrganizationalUnitName() {
		return organizationalUnitName;
	}

	public void setOrganizationalUnitName(String organizationalUnitName) {
		this.organizationalUnitName = organizationalUnitName;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public boolean equals(Object obj) {
		return EqualsBuilder.reflectionEquals(this, obj);
	}

	public int hashCode() {
		return HashCodeBuilder.reflectionHashCode(this);
	}

	public String toString() {
		return ToStringBuilder.reflectionToString(this,
				ToStringStyle.MULTI_LINE_STYLE);
	}
}