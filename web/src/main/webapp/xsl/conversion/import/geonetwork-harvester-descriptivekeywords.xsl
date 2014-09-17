<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0"
	xmlns:gml="http://www.opengis.net/gml"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:gco="http://www.isotc211.org/2005/gco"
	xmlns:gmd="http://www.isotc211.org/2005/gmd" exclude-result-prefixes="#all">

	<xsl:template match="/root">
		<xsl:apply-templates select="gmd:MD_Metadata"/>
	</xsl:template>

	<!-- ================================================================= -->

	<xsl:template match="gmd:MD_Metadata">
		<xsl:copy>
			<xsl:apply-templates select="@*"/>
			<xsl:apply-templates select="node()"/>
		</xsl:copy>
	</xsl:template>

	<xsl:template match="@*|node()">
	    <xsl:copy>
	        <xsl:apply-templates select="@*|node()"/>
      </xsl:copy>
	</xsl:template>
	<!-- Only set metadataStandardName and metadataStandardVersion
	if not set. -->
	<xsl:template match="gmd:descriptiveKeywords" priority="10">
		<xsl:variable name="descriptiveKeywordsElementName" select="name(.)" />
		<xsl:variable name="previousDescriptiveKeywordsSiblingsCount" select="count(preceding-sibling::*[name(.) = $descriptiveKeywordsElementName])" />
		<xsl:if test="$previousDescriptiveKeywordsSiblingsCount=0">
			<gmd:descriptiveKeywords>
				<gmd:MD_Keywords>
				   <gmd:keyword>
					  <gco:CharacterString>Global</gco:CharacterString>
				   </gmd:keyword>
				   <gmd:type gco:nilReason="missing">
					  <gmd:MD_KeywordTypeCode codeList="http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/Codelist/ML_gmxCodelists.xml#MD_KeywordTypeCode"
											  codeListValue=""/>
				   </gmd:type>
				   <gmd:thesaurusName>
					  <gmd:CI_Citation>
						 <gmd:title>
							<gco:CharacterString>SIGMA Regions</gco:CharacterString>
						 </gmd:title>
						 <gmd:date>
							<gmd:CI_Date>
							   <gmd:date>
								  <gco:Date>2014-05-06</gco:Date>
							   </gmd:date>
							   <gmd:dateType>
								  <gmd:CI_DateTypeCode codeList="http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/Codelist/ML_gmxCodelists.xml#CI_DateTypeCode"
													   codeListValue="publication"/>
							   </gmd:dateType>
							</gmd:CI_Date>
						 </gmd:date>
					  </gmd:CI_Citation>
				   </gmd:thesaurusName>
				</gmd:MD_Keywords>
			</gmd:descriptiveKeywords>
			<gmd:descriptiveKeywords>
				<gmd:MD_Keywords>
				   <gmd:keyword>
					  <gco:CharacterString>Long-term timeseries</gco:CharacterString>
				   </gmd:keyword>
				   <gmd:type gco:nilReason="missing">
					  <gmd:MD_KeywordTypeCode codeList="http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/Codelist/ML_gmxCodelists.xml#MD_KeywordTypeCode"
											  codeListValue=""/>
				   </gmd:type>
				   <gmd:thesaurusName>
					  <gmd:CI_Citation>
						 <gmd:title>
							<gco:CharacterString>SIGMA Years</gco:CharacterString>
						 </gmd:title>
						 <gmd:date>
							<gmd:CI_Date>
							   <gmd:date>
								  <gco:Date>2014-05-06</gco:Date>
							   </gmd:date>
							   <gmd:dateType>
								  <gmd:CI_DateTypeCode codeList="http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/Codelist/ML_gmxCodelists.xml#CI_DateTypeCode"
													   codeListValue="publication"/>
							   </gmd:dateType>
							</gmd:CI_Date>
						 </gmd:date>
					  </gmd:CI_Citation>
				   </gmd:thesaurusName>
				</gmd:MD_Keywords>
			</gmd:descriptiveKeywords>
			<gmd:descriptiveKeywords>
				<gmd:MD_Keywords>
				   <gmd:keyword>
					  <gco:CharacterString>Remote sensing data_Bio-physical parameters</gco:CharacterString>
				   </gmd:keyword>
				   <gmd:type gco:nilReason="missing">
					  <gmd:MD_KeywordTypeCode codeList="http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/Codelist/ML_gmxCodelists.xml#MD_KeywordTypeCode"
											  codeListValue=""/>
				   </gmd:type>
				   <gmd:thesaurusName>
					  <gmd:CI_Citation>
						 <gmd:title>
							<gco:CharacterString>SIGMA DataTypes</gco:CharacterString>
						 </gmd:title>
						 <gmd:date>
							<gmd:CI_Date>
							   <gmd:date>
								  <gco:Date>2014-05-06</gco:Date>
							   </gmd:date>
							   <gmd:dateType>
								  <gmd:CI_DateTypeCode codeList="http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/Codelist/ML_gmxCodelists.xml#CI_DateTypeCode"
													   codeListValue="publication"/>
							   </gmd:dateType>
							</gmd:CI_Date>
						 </gmd:date>
					  </gmd:CI_Citation>
				   </gmd:thesaurusName>
				</gmd:MD_Keywords>
			</gmd:descriptiveKeywords>
		</xsl:if>
		<xsl:copy-of select="."/>
	</xsl:template>
</xsl:stylesheet>