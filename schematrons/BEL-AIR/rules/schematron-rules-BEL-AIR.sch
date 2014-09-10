<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<!--BEL-AIR Metadata Schematron regels -->
<!-- 2014-08-08 Versie 0.9 -->
<sch:schema xmlns:sch="http://purl.oclc.org/dsdl/schematron" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" queryBinding="xslt2">
	<sch:title xmlns="http://www.w3.org/2001/XMLSchema">Technisch BEL-AIR voorschrift voor metadata</sch:title>
	<sch:ns prefix="gml" uri="http://www.opengis.net/gml"/>
	<sch:ns prefix="gmd" uri="http://www.isotc211.org/2005/gmd"/>
	<sch:ns prefix="srv" uri="http://www.isotc211.org/2005/srv"/>
	<sch:ns prefix="gco" uri="http://www.isotc211.org/2005/gco"/>
	<sch:ns prefix="geonet" uri="http://www.fao.org/geonetwork"/>
	<sch:ns prefix="skos" uri="http://www.w3.org/2004/02/skos/core#"/>
	<sch:ns prefix="xlink" uri="http://www.w3.org/1999/xlink"/>
	<!-- BEL-AIR SC-1 -->
	<sch:pattern>
		<sch:title>Minimum one keyword must be selected from the thesaurus ‘BEL-AIR-Sites’ dated on 2014-05-06</sch:title>
		<sch:rule context="//gmd:MD_DataIdentification">
			<sch:let name="belair-thesaurus" value="document(concat('file:///', $thesaurusDir, '/external/thesauri/place/BEL-AIR-Sites.rdf'))"/>
			<sch:let name="belair-theme" value="$belair-thesaurus//skos:Concept"/>
			<sch:assert test="count($belair-theme) > 0">
				BEL-AIR Sites thesaurus not found. 
			</sch:assert>
			<sch:let name="keyword" value="gmd:descriptiveKeywords/*/gmd:keyword/gco:CharacterString
					[../../gmd:thesaurusName/*/gmd:title/*/text()='BEL-AIR Sites' and
					../../gmd:thesaurusName/*/gmd:date/*/gmd:date/gco:Date/text()='2014-05-06' and
					../../gmd:thesaurusName/*/gmd:date/*/gmd:dateType/gmd:CI_DateTypeCode/@codeListValue='publication']"/>
			<sch:let name="belair-theme-selected" value="count($belair-thesaurus//skos:Concept[skos:prefLabel[@xml:lang='en'] = $keyword])"/>
			<sch:assert test="$belair-theme-selected >0">
				No English keyword found from the BEL-AIR Sites thesaurus dated on 2014-05-06.
			</sch:assert>
			<sch:report test="$belair-theme-selected > 0">
				An English keyword: <sch:value-of select="$keyword"/> is found from the BEL-AIR Sites thesaurus dated on 2014-05-06.
			</sch:report>
		</sch:rule>
	</sch:pattern>
	<sch:pattern>
		<sch:title>Minimum one keyword must be selected from the thesaurus ‘BEL-AIR-DataTypes’ dated on 2014-05-06</sch:title>
		<sch:rule context="//gmd:MD_DataIdentification">
			<sch:let name="belair-thesaurus" value="document(concat('file:///', $thesaurusDir, '/external/thesauri/theme/BEL-AIR-DataTypes.rdf'))"/>
			<sch:let name="belair-theme" value="$belair-thesaurus//skos:Concept"/>
			<sch:assert test="count($belair-theme) > 0">
				BEL-AIR DataTypes thesaurus not found. 
			</sch:assert>
			<sch:let name="keyword" value="gmd:descriptiveKeywords/*/gmd:keyword/gco:CharacterString
					[../../gmd:thesaurusName/*/gmd:title/*/text()='BEL-AIR DataTypes' and
					../../gmd:thesaurusName/*/gmd:date/*/gmd:date/gco:Date/text()='2014-05-06' and
					../../gmd:thesaurusName/*/gmd:date/*/gmd:dateType/gmd:CI_DateTypeCode/@codeListValue='publication']"/>
			<sch:let name="belair-theme-selected" value="count($belair-thesaurus//skos:Concept[skos:prefLabel[@xml:lang='en'] = $keyword])"/>
			<sch:assert test="$belair-theme-selected >0">
				No English keyword found from the BEL-AIR DataTypes thesaurus dated on 2014-05-06.
			</sch:assert>
			<sch:report test="$belair-theme-selected > 0">
				An English keyword: <sch:value-of select="$keyword"/> is found from the BEL-AIR DataTypes thesaurus dated on 2014-05-06.
			</sch:report>
		</sch:rule>
	</sch:pattern>
	<sch:pattern>
		<sch:title>Minimum one keyword must be selected from the thesaurus ‘BEL-AIR-Campaigns’ dated on 2014-05-06</sch:title>
		<sch:rule context="//gmd:MD_DataIdentification">
			<sch:let name="belair-thesaurus" value="document(concat('file:///', $thesaurusDir, '/external/thesauri/temporal/BEL-AIR-Campaigns.rdf'))"/>
			<sch:let name="belair-theme" value="$belair-thesaurus//skos:Concept"/>
			<sch:assert test="count($belair-theme) > 0">
				BEL-AIR Campaigns thesaurus not found. 
			</sch:assert>
			<sch:let name="keyword" value="gmd:descriptiveKeywords/*/gmd:keyword/gco:CharacterString
					[../../gmd:thesaurusName/*/gmd:title/*/text()='BEL-AIR Campaigns' and
					../../gmd:thesaurusName/*/gmd:date/*/gmd:date/gco:Date/text()='2014-05-06' and
					../../gmd:thesaurusName/*/gmd:date/*/gmd:dateType/gmd:CI_DateTypeCode/@codeListValue='publication']"/>
			<sch:let name="belair-theme-selected" value="count($belair-thesaurus//skos:Concept[skos:prefLabel[@xml:lang='en'] = $keyword])"/>
			<sch:assert test="$belair-theme-selected >0">
				No English keyword found from the BEL-AIR Campaigns thesaurus dated on 2014-05-06.
			</sch:assert>
			<sch:report test="$belair-theme-selected > 0">
				An English keyword: <sch:value-of select="$keyword"/> is found from the BEL-AIR Campaigns thesaurus dated on 2014-05-06.
			</sch:report>
		</sch:rule>
	</sch:pattern>
</sch:schema>
