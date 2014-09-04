<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	
	<xsl:template match="/">
		<div>
			<form id="forgottenpwd" name="forgottenpwd" accept-charset="UTF-8" action="{/root/gui/locService}/password.forgotten.submit" method="POST">
				<table align="center">
					<tr>
						<th class="padded"><xsl:value-of select="/root/gui/strings/username"/></th>
						<td class="padded"><input class="content" type="text" name="username" size="20"/></td>
					</tr>
				</table>
				<div align="center">
					<input type="button"  class="content" onclick="processForgottenPwdSubmit('{/root/gui/strings/usernameMandatory}')" value="{/root/gui/strings/accept}"/>
				</div>
			</form>
		</div>
	</xsl:template>
		
</xsl:stylesheet>
