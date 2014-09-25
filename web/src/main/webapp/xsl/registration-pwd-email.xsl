<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    
    <!--
    Create xml containing registration password email details from user/instance details passed
    Allows email to be customised without changing java service - info supplied is as follows
    
<root>
  <site>localtrunk</site>
  <siteURL>http://127.0.0.1:8122/geonetwork</siteURL>
  <request>
    <zip>7001</zip>
    <address>University of Tasmania, Hobart</address>
    <email>craig.jones@utas.edu.au</email>
    <name>Craig</name>
    <state>Tas</state>
    <surname>Jones</surname>
    <org>emii</org>
    <kind>uni</kind>
    <profile>RegisteredUser</profile>
    <country>au</country>
  </request>
  <password>3MRaEX</password>
</root>

    -->
    <xsl:template match="/">
    	<email>
    		<subject>Welcome to <xsl:value-of select="/root/site"/><xsl:text> </xsl:text><xsl:value-of select="/root/request/name"/><xsl:text> </xsl:text><xsl:value-of select="/root/request/surname"/></subject>
			<content>
Dear <xsl:value-of select="/root/request/name"/><xsl:text> </xsl:text><xsl:value-of select="/root/request/surname"/>,

You are successfully registered on <xsl:value-of select="/root/site"/>.
  
Your account is: 
username :	<xsl:value-of select="/root/request/email"/>
password :	******** <!-- <xsl:value-of select="/root/password"/>-->
<!-- usertype :	REGISTEREDUSER-->
<xsl:if test="/root/request/profile != 'RegisteredUser'">
You've told us that you want to be "<xsl:value-of select="/root/request/profile"/>", you will be contacted by our office soon.
</xsl:if>
To log in and access your account, please click on the link below.
<xsl:value-of select="/root/siteURL"/> 

Thank you for your registration. 


Best regards,
The SIGMA Geoportal team



<!-- <span style="color: #367DC9;">-->VITO SIGMA Geoportal

VITO - Remote Sensing Unit
Boeretang 200 - 2400 Mol - Belgium
T: +32 14 33 68 14 - F: +32 14 32 27 95
E: sigmageoportal@vgt.vito.be
 
Visit our website: <!-- </span>--><xsl:value-of select="/root/siteURL"/>
			</content>
    	</email>
    </xsl:template>
    
</xsl:stylesheet>
