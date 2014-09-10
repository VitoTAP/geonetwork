<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    
    <xsl:template match="/">
    	<div>
	        <form id="userregisterform" name="userregisterform" accept-charset="UTF-8" action="{/root/gui/locService}/user.register.submit" method="POST">
	             <table align="center">                
	                <tr>
	                    <th class="padded"><xsl:value-of select="/root/gui/strings/firstname"/> (*)</th>
	                    <td class="padded"><input class="content" type="text" name="name" value=""/></td>
	                </tr>
	                <tr>
	                    <th class="padded"><xsl:value-of select="/root/gui/strings/surname"/> (*)</th>
	                    <td class="padded"><input class="content" type="text" name="surname" value=""/></td>
	                </tr>
					<tr>
						<th class="padded"><xsl:value-of select="/root/gui/strings/password"/> (*)</th>
						<td class="padded"><input class="content" type="password" name="password" value=""/></td>
					</tr>
					<tr>
						<th class="padded"><xsl:value-of select="/root/gui/strings/confirmPassword"/> (*)</th>
						<td class="padded"><input class="content" type="password" name="password2" value=""/></td>
					</tr>
	                <tr>
	                    <th class="padded"><xsl:value-of select="/root/gui/strings/email"/> (*)</th>
	                    <td class="padded"><input class="content" type="text" name="email" value=""/></td>
	                </tr>
	                <tr>
	                    <th class="padded"><xsl:value-of select="/root/gui/strings/address"/></th>
	                    <td class="padded"><input class="content" type="text" name="address" value=""/></td>
	                </tr>
	                 <tr>
	                     <th class="padded"><xsl:value-of select="/root/gui/strings/city"/></th>
	                     <td class="padded"><input class="content" type="text" name="city" value=""/></td>
	                 </tr>
	                 <tr>
	                     <th class="padded"><xsl:value-of select="/root/gui/strings/zip"/></th>
	                     <td class="padded"><input class="content" type="text" name="zip" value="" size="8"/></td>
	                 </tr>
<!--
	                 <tr>
	                    <th class="padded"><xsl:value-of select="/root/gui/strings/state"/></th>
	                    <td class="padded"><input class="content" type="text" name="state" value="" size="8"/></td>
	                </tr>
-->
	                <tr>
	                    <th class="padded"><xsl:value-of select="/root/gui/strings/country"/> (*)</th>
	                    <td class="padded">
	                        <select class="content" size="1" name="country"> 
	                            <option value=""/> 
	                            <xsl:for-each select="/root/gui/countries/country">
	                                <option value="{@iso2}">
	                                    <xsl:if test="string(/root/response/record/country)=@iso2">
	                                        <xsl:attribute name="selected"/>
	                                    </xsl:if>
	                                    <xsl:value-of select="."/>
	                                </option>
	                            </xsl:for-each>
	                        </select>
	                    </td>
	                </tr>
	                
	                <tr>
	                    <th class="padded"><xsl:value-of select="/root/gui/strings/organisation"/> (*)</th>
	                    <td class="padded"><input class="content" type="text" name="org" value="{/root/response/record/organisation}"/></td>
	                </tr>
	                <tr>
	                    <th class="padded"><xsl:value-of select="/root/gui/strings/kind"/></th>
	                    <td class="padded">
	                        <select class="content" size="1" name="kind">
	                            <xsl:for-each select="/root/gui/strings/kindChoice">
	                                <option value="{@value}">
	                                    <xsl:value-of select="."/>
	                                </option>
	                            </xsl:for-each>
	                        </select>
	                    </td>
	                </tr>
	                <input type="hidden" name="profile" value="RegisteredUser"/>
	                    <!-- 
	                <tr>
	                    <th class="padded"><xsl:value-of select="/root/gui/strings/profile"/></th>
	                    <td class="padded">
	                        <select class="content" size="1" name="profile">
	                            <xsl:for-each select="/root/gui/strings/profileChoice">
	                                <option value="{@value}">
	                                    <xsl:value-of select="."/>
	                                </option>
	                            </xsl:for-each>
	                        </select>
	                    </td>
	                </tr> 
	                     -->
									<tr>
										<td class="padded" colspan="2">
											<xsl:text> </xsl:text>
										</td>
									</tr>
	            </table>
				<div align="center">
		                <input type="button" class="content" onclick="$('userregisterform').reset()" value="{/root/gui/strings/reset}"/>
		                &#160;
		                <input type="button" class="content" onclick="processRegSub('{/root/gui/strings/spacesNot}','{/root/gui/strings/firstnameMandatory}', '{/root/gui/strings/surnameMandatory}',
		                '{/root/gui/strings/passwordLength}','{/root/gui/strings/passwordDoNotMatch}','{/root/gui/strings/emailAddressInvalid}', '{/root/gui/strings/countryMandatory}', '{/root/gui/strings/organisationMandatory}', '{/root/gui/strings/yourRegistration}','{/root/gui/strings/registrationFailed}')" value="{/root/gui/strings/register}"/>
				</div>
			</form>
		</div>
    </xsl:template>
</xsl:stylesheet>

