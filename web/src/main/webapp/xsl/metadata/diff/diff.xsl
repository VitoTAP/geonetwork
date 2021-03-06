<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:geonet="http://www.fao.org/geonetwork"
                xmlns:exslt="http://exslt.org/common"
                xmlns:dc = "http://purl.org/dc/elements/1.1/"
                xmlns:gmd="http://www.isotc211.org/2005/gmd"
                xmlns:gco="http://www.isotc211.org/2005/gco"
                xmlns:saxon="http://saxon.sf.net/"
                extension-element-prefixes="saxon"
                exclude-result-prefixes="gco gmd dc exslt geonet saxon"
        >

    <xsl:include href="../common.xsl"/>

	<xsl:variable name="mode" select="/root/request/currTab"/>

    <!--
     show metadata form
     -->

    <xsl:template match="/">
<!-- 
        <html>
            <body>
                <xsl:call-template name="content"/>
            </body>
        </html>
-->
		<xsl:variable name="sourceId" select="/root/response/source/gmd:MD_Metadata/geonet:info/id"/>
		<xsl:variable name="targetId" select="/root/response/target/gmd:MD_Metadata/geonet:info/id"/>
		<xsl:message><xsl:value-of select="$sourceId"/></xsl:message>
		<xsl:message><xsl:value-of select="$targetId"/></xsl:message>
		<xsl:variable name="compareSameDoc" select="$sourceId=$targetId"/>
		
        <html>
            <body>
        <div style="float: left; height: inherit; width: 50%">
            <xsl:for-each select="/root/response/source/*">

                <xsl:variable name="metadata" select="."/>
                <xsl:variable name="schema" select="$metadata/geonet:info/schema"/>

                <div class="metadata" style="height: inherit">
                    <div class="x-toolbar x-small-editor x-toolbar-layout-ct" style="padding:5px;">
                        <xsl:choose>
	                        <xsl:when test="$compareSameDoc">
		                        <xsl:choose>
		                            <xsl:when test="string(geonet:info/workspace)='true'">
		                                <xsl:value-of select="/root/gui/strings/workspaceview"/>
		                            </xsl:when>
		                            <xsl:otherwise>
		                                <xsl:value-of select="/root/gui/strings/workspaceoriginal"/>
		                            </xsl:otherwise>
		                        </xsl:choose>
	                        </xsl:when>
	                        <xsl:otherwise>
                               <xsl:value-of select="/root/gui/strings/firstDocument"/>
	                        </xsl:otherwise>
                        </xsl:choose>
                    </div>


                    <div id="source-container" style="position:relative;overflow:auto;height:inherit;">
                        <xsl:variable name="schemaTemplate" select="concat('view-with-header-',$schema)"/>
                        <saxon:call-template name="{$schemaTemplate}">
                            <xsl:with-param name="tabs">
                                <xsl:apply-templates mode="elementEP" select=".">
                                    <xsl:with-param name="edit" select="false()"/>
                                </xsl:apply-templates>
                            </xsl:with-param>
                        </saxon:call-template>
                    </div>
                </div>
            </xsl:for-each>
        </div>

        <div style="float: left; height: inherit; width: 50%">
            <xsl:for-each select="/root/response/target/*">

                <xsl:variable name="metadata" select="."/>
                <xsl:variable name="schema" select="$metadata/geonet:info/schema"/>

                <div class="metadata" style="height: inherit">
                    <div class="x-toolbar x-small-editor x-toolbar-layout-ct" style="padding:5px;height:13px;">
                        <xsl:choose>
	                        <xsl:when test="$compareSameDoc">
		                        <xsl:choose>
		                            <xsl:when test="string(geonet:info/workspace)='true'">
		                                <xsl:value-of select="/root/gui/strings/workspaceview"/>
		                            </xsl:when>
		                            <xsl:otherwise>
		                                <xsl:value-of select="/root/gui/strings/modifiedVersion"/>
		                            </xsl:otherwise>
	                            </xsl:choose>
	                        </xsl:when>
	                        <xsl:otherwise>
                               <xsl:value-of select="/root/gui/strings/secondDocument"/>
							</xsl:otherwise>
	                    </xsl:choose>
                    </div>
                    <div id="target-container" style="position:relative;overflow:auto;height:inherit;border-left:2px solid #ccc">
                        <xsl:variable name="schemaTemplate" select="concat('view-with-header-',$schema)"/>
                        <saxon:call-template name="{$schemaTemplate}">
                            <xsl:with-param name="tabs">
                                <xsl:apply-templates mode="elementEP" select=".">
                                    <xsl:with-param name="edit" select="false()"/>
                                </xsl:apply-templates>
                            </xsl:with-param>
                        </saxon:call-template>
                    </div>
                </div>
            </xsl:for-each>
        </div>
            </body>
        </html>
    </xsl:template>

</xsl:stylesheet>