<?xml version="1.0" encoding="UTF-8" standalone="yes"?>					
<!--BELAIR Metadata Schematron regels -->					
<!-- 2014-08-08 Versie 0.9 -->					
<sch:schema xmlns:sch="http://purl.oclc.org/dsdl/schematron" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" queryBinding="xslt2">					
	<sch:title xmlns="http://www.w3.org/2001/XMLSchema">Technisch BELAIR voorschrift voor metadata</sch:title>				
	<sch:ns prefix="gml" uri="http://www.opengis.net/gml"/>				
	<sch:ns prefix="gmd" uri="http://www.isotc211.org/2005/gmd"/>				
	<sch:ns prefix="srv" uri="http://www.isotc211.org/2005/srv"/>				
	<sch:ns prefix="gco" uri="http://www.isotc211.org/2005/gco"/>				
	<sch:ns prefix="geonet" uri="http://www.fao.org/geonetwork"/>				
	<sch:ns prefix="skos" uri="http://www.w3.org/2004/02/skos/core#"/>				
	<sch:ns prefix="xlink" uri="http://www.w3.org/1999/xlink"/>				
	<!-- BELAIR SC-1 -->				
	<sch:pattern>				
		<sch:title>$loc/strings/BELAIR-identification</sch:title>			
		<sch:rule context="//gmd:MD_DataIdentification">			
			<sch:let name="belair-thesaurus" value="document(concat('file:///', $thesaurusDir, '/external/thesauri/temporal/BELAIR-Campaigns.rdf'))"/>		
			<sch:let name="belair-campaigns" value="$belair-thesaurus//skos:Concept"/>		
			<sch:assert test="count($belair-campaigns) > 0">		
				$loc/strings/BELAIRCampaignsThesaurusNotFound	
			</sch:assert>		
			<sch:let name="keyword" value="gmd:descriptiveKeywords/*/gmd:keyword/gco:CharacterString		
					[../../gmd:thesaurusName/*/gmd:title/*/text()='BELAIR Campaigns' and
					../../gmd:thesaurusName/*/gmd:date/*/gmd:date/gco:Date/text()='2014-05-06' and
					../../gmd:thesaurusName/*/gmd:date/*/gmd:dateType/gmd:CI_DateTypeCode/@codeListValue='publication']"/>
			<sch:let name="belair-campaign-selected" value="count($belair-thesaurus//skos:Concept[skos:prefLabel[@xml:lang='en'] = $keyword])"/>		
			<sch:assert test="$belair-campaign-selected >0">		
				$loc/strings/NoBELAIRCampaignSelected	
			</sch:assert>		
			<sch:report test="$belair-campaign-selected > 0">		
				<sch:value-of select="document(concat($loc/strings/BELAIRKeywordFound-1, ' ', $keyword, ' ', $loc/strings/BELAIRKeywordFound-2, ' BELAIR Campaigns ', $loc/strings/BELAIRKeywordFound-3))"/>	
			</sch:report>		
		</sch:rule>			
	</sch:pattern>				
	<sch:pattern>				
		<sch:title>$loc/strings/BELAIR-identification-2</sch:title>			
		<sch:rule context="//gmd:MD_DataIdentification">			
			<sch:let name="belair-thesaurus" value="document(concat('file:///', $thesaurusDir, '/external/thesauri/theme/BELAIR-DataTypes.rdf'))"/>		
			<sch:let name="belair-datatypes" value="$belair-thesaurus//skos:Concept"/>		
			<sch:assert test="count($belair-datatypes) > 0">		
				$loc/strings/BELAIRDatatypesThesaurusNotFound	
			</sch:assert>		
			<sch:let name="keyword" value="gmd:descriptiveKeywords/*/gmd:keyword/gco:CharacterString		
					[../../gmd:thesaurusName/*/gmd:title/*/text()='BELAIR DataTypes' and
					../../gmd:thesaurusName/*/gmd:date/*/gmd:date/gco:Date/text()='2014-05-06' and
					../../gmd:thesaurusName/*/gmd:date/*/gmd:dateType/gmd:CI_DateTypeCode/@codeListValue='publication']"/>
			<sch:let name="belair-datatype-selected" value="count($belair-thesaurus//skos:Concept[skos:prefLabel[@xml:lang='en'] = $keyword])"/>		
			<sch:assert test="$belair-datatype-selected >0">		
				$loc/strings/NoBELAIRDatatypeKeywordFound	
			</sch:assert>		
			<sch:report test="$belair-datatype-selected > 0">		
				<sch:value-of select="document(concat($loc/strings/BELAIRKeywordFound-1, ' ', $keyword, ' ', $loc/strings/BELAIRKeywordFound-2, ' BELAIR Datatypes ', $loc/strings/BELAIRKeywordFound-3))"/>	
			</sch:report>		
		</sch:rule>			
	</sch:pattern>				
	<sch:pattern>				
		<sch:title>$loc/strings/BELAIR-identification-3</sch:title>			
		<sch:rule context="//gmd:MD_DataIdentification">			
			<sch:let name="belair-thesaurus" value="document(concat('file:///', $thesaurusDir, '/external/thesauri/place/BELAIR-Sites.rdf'))"/>		
			<sch:let name="belair-sites" value="$belair-thesaurus//skos:Concept"/>		
			<sch:assert test="count($belair-sites) > 0">		
				$loc/strings/BELAIRSitesThesaurusNotFound	
			</sch:assert>		
			<sch:let name="keyword" value="gmd:descriptiveKeywords/*/gmd:keyword/gco:CharacterString		
					[../../gmd:thesaurusName/*/gmd:title/*/text()='BELAIR Sites' and
					../../gmd:thesaurusName/*/gmd:date/*/gmd:date/gco:Date/text()='2014-05-06' and
					../../gmd:thesaurusName/*/gmd:date/*/gmd:dateType/gmd:CI_DateTypeCode/@codeListValue='publication']"/>
			<sch:let name="belair-site-selected" value="count($belair-thesaurus//skos:Concept[skos:prefLabel[@xml:lang='en'] = $keyword])"/>		
			<sch:assert test="$belair-site-selected >0">		
				$loc/strings/NoBELAIRSitesKeywordFound	
			</sch:assert>		
			<sch:report test="$belair-site-selected > 0">		
				<sch:value-of select="document(concat($loc/strings/BELAIRKeywordFound-1, ' ', $keyword, ' ', $loc/strings/BELAIRKeywordFound-2, ' BELAIR Sites ', $loc/strings/BELAIRKeywordFound-3))"/>	
			</sch:report>		
		</sch:rule>			
	</sch:pattern>				
	<!-- General SC-1 -->				
	<sch:pattern>				
		<sch:title>$loc/strings/identification</sch:title>			
		<sch:rule context="//gmd:MD_Metadata">			
			<sch:let name="fileIdentifier" value="gmd:fileIdentifier and not(normalize-space(gmd:fileIdentifier) = '')"/>		
			<sch:let name="fileIdentifierValue" value="gmd:fileIdentifier/*/text()"/>		
			<sch:assert test="$fileIdentifier">$loc/strings/fileIdentifierMissing</sch:assert>		
			<sch:report test="$fileIdentifier"><sch:value-of select="document(concat($loc/strings/fileIdentifierPresent, ' ', $fileIdentifierValue))"/>		
			</sch:report>		
		</sch:rule>			
	</sch:pattern>				
	<!-- General SC2-->				
	<sch:pattern>				
		<sch:title>$loc/strings/identification-2</sch:title>			
					
        <sch:rule context="//gmd:MD_Metadata[					
             gmd:hierarchyLevel/gmd:MD_ScopeCode/@codeListValue/normalize-space(.) = 'series'					
             or gmd:hierarchyLevel/gmd:MD_ScopeCode/@codeListValue/normalize-space(.) = 'dataset'					
             or gmd:hierarchyLevel/gmd:MD_ScopeCode/@codeListValue/normalize-space(.) = '']">					
                            <sch:let name="referenceSystemInfo" value="gmd:referenceSystemInfo"/>					
             <sch:assert test="$referenceSystemInfo">$loc/strings/referenceSystemInfoMissing</sch:assert>					
        </sch:rule>					
					
		<sch:rule context="//gmd:MD_Metadata[			
        			gmd:hierarchyLevel/gmd:MD_ScopeCode/@codeListValue/normalize-space(.) = 'series'		
        			or gmd:hierarchyLevel/gmd:MD_ScopeCode/@codeListValue/normalize-space(.) = 'dataset'		
        			or gmd:hierarchyLevel/gmd:MD_ScopeCode/@codeListValue/normalize-space(.) = '']/gmd:referenceSystemInfo">		
                        <sch:let name="ReferenceSystemInfo" value="not(normalize-space(gmd:MD_ReferenceSystem/gmd:referenceSystemIdentifier/gmd:RS_Identifier/gmd:code)= '')"/>					
        			<sch:let name="ReferenceSystemInfoCodeValue" value="gmd:MD_ReferenceSystem/gmd:referenceSystemIdentifier/gmd:RS_Identifier/gmd:code/*/text()"/>		
        			<sch:assert test="$ReferenceSystemInfo">$loc/strings/referenceSystemInfoCodeMissing</sch:assert>		
        			<sch:report test="$ReferenceSystemInfo"><sch:value-of select="document(concat($loc/strings/referenceSystemInfoCodePresent,' ', $ReferenceSystemInfoCodeValue))"/>		
        			</sch:report>		
        		</sch:rule>			
	</sch:pattern>				
	<!-- General SC3 -->				
	<sch:pattern>				
		<sch:title>$loc/strings/identification-3</sch:title>			
		<sch:rule context="//*/gmd:CI_ResponsibleParty/gmd:organisationName">			
			<sch:let name="organisationName" value=". and not(normalize-space(.)= '')"/>		
			<sch:let name="organisationNameValue" value="./*/text()"/>		
			<sch:assert test="$organisationName">$loc/strings/organisationNameMissing</sch:assert>		
			<sch:report test="$organisationName">$loc/strings/organisationNamePresent <sch:value-of select="$organisationNameValue"/></sch:report>		
		</sch:rule>			
	</sch:pattern>				
	<!-- General SC5 -->				
	<sch:pattern>				
		<sch:title>$loc/strings/identification-5</sch:title>			
		<sch:rule context="//gmd:MD_DataIdentification[/gmd:MD_Metadata/gmd:language/*/text()='dut']">			
			<sch:let name="inspire-thesaurus" value="document(concat('file:///', $thesaurusDir, '/external/thesauri/theme/inspire-theme.rdf'))"/>		
			<sch:let name="inspire-theme" value="$inspire-thesaurus//skos:Concept"/>		
			<sch:assert test="count($inspire-theme) > 0">$loc/strings/inspireThemeError</sch:assert>		
			<sch:let name="keyword" value="gmd:descriptiveKeywords/*/gmd:keyword/gco:CharacterString		
					[../../gmd:thesaurusName/*/gmd:title/*/text()='GEMET - INSPIRE thema''s, versie 1.0' and
					../../gmd:thesaurusName/*/gmd:date/*/gmd:date/gco:Date/text()='2008-06-01' and
					../../gmd:thesaurusName/*/gmd:date/*/gmd:dateType/gmd:CI_DateTypeCode/@codeListValue='publication']"/>
			<sch:let name="inspire-theme-selected" value="count($inspire-thesaurus//skos:Concept[skos:prefLabel[@xml:lang='nl'] = $keyword])"/>		
			<sch:assert test="$inspire-theme-selected >0">$loc/strings/noKeywordFound</sch:assert>		
			<sch:report test="$inspire-theme-selected > 0"><sch:value-of select="document(concat($loc/strings/keywordFound-1,' ', $keyword,' ', $loc/strings/keywordFound-2))"/></sch:report>		
		</sch:rule>			
	</sch:pattern>				
	<!-- General SC-6 --> 				
	<sch:pattern>				
		<sch:title>$loc/strings/identification-6</sch:title>			
		<sch:rule context="//gmd:onLine/gmd:CI_OnlineResource">			
			<sch:let name="fileType" value="gmd:applicationProfile and not(normalize-space(gmd:applicationProfile) = '')"/>		
			<sch:let name="fileTypeValue" value="gmd:applicationProfile/*/text()"/>		
			<sch:assert test="$fileType">$loc/strings/fileTypeMissing</sch:assert>		
			<sch:report test="$fileType"><sch:value-of select="document(concat($loc/strings/fileTypePresent, ' ', $fileTypeValue))"/>		
			</sch:report>		
		</sch:rule>			
	</sch:pattern>
</sch:schema>					
