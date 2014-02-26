<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:fo="http://www.w3.org/1999/XSL/Format" xmlns:gmd="http://www.isotc211.org/2005/gmd"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:gml="http://www.opengis.net/gml"
	xmlns:fra="http://www.cnig.gouv.fr/2005/fra" xmlns:srv="http://www.isotc211.org/2005/srv"
	xmlns:gts="http://www.isotc211.org/2005/gts" xmlns:gco="http://www.isotc211.org/2005/gco"
	xmlns:geonet="http://www.fao.org/geonetwork" xmlns:date="http://exslt.org/dates-and-times"
	xmlns:exslt="http://exslt.org/common" xmlns:xs="http://www.w3.org/2001/XMLSchema"
	exclude-result-prefixes="xs" version="2.0">


	<xsl:template name="metadata-fop-iso19139-unused">
		<xsl:param name="schema" />

		<!-- TODO improve block level element using mode -->
		<xsl:for-each select="*[namespace-uri(.)!=$geonetUri]">

			<xsl:call-template name="blockElementFop">
				<xsl:with-param name="block">
					<xsl:choose>
						<xsl:when test="count(*/*) > 1">
							<xsl:for-each select="*">
								<xsl:call-template name="blockElementFop">
									<xsl:with-param name="label">
										<xsl:call-template name="getTitle">
											<xsl:with-param name="name" select="name()" />
											<xsl:with-param name="schema" select="$schema" />
										</xsl:call-template>
									</xsl:with-param>
									<xsl:with-param name="block">
										<xsl:apply-templates mode="elementFop"
											select=".">
											<xsl:with-param name="schema" select="$schema" />
										</xsl:apply-templates>
									</xsl:with-param>
								</xsl:call-template>
							</xsl:for-each>
						</xsl:when>
						<xsl:otherwise>
							<xsl:apply-templates mode="elementFop"
								select=".">
								<xsl:with-param name="schema" select="$schema" />
							</xsl:apply-templates>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:with-param>
			</xsl:call-template>
		</xsl:for-each>
	</xsl:template>


	<xsl:template name="metadata-fop-iso19139">
		<xsl:param name="schema" />

		<!-- Title -->
		<xsl:variable name="title">
			<xsl:apply-templates mode="elementFop"
				select="./gmd:identificationInfo/*/gmd:citation/gmd:CI_Citation/gmd:title">
				<xsl:with-param name="schema" select="$schema" />
			</xsl:apply-templates>
		</xsl:variable>
		<xsl:call-template name="blockElementFop">
			<xsl:with-param name="block" select="$title" />
		</xsl:call-template>

		<!-- Date -->
		<xsl:variable name="date">
			<xsl:apply-templates mode="elementFop"
				select="./gmd:identificationInfo/*/gmd:citation/gmd:CI_Citation/gmd:date/gmd:CI_Date/gmd:date |
                ./gmd:identificationInfo/*/gmd:citation/gmd:CI_Citation/gmd:date/gmd:CI_Date/gmd:dateType/gmd:CI_DateTypeCode/@codeListValue">
				<xsl:with-param name="schema" select="$schema" />
			</xsl:apply-templates>
		</xsl:variable>
		<xsl:call-template name="blockElementFop">
			<xsl:with-param name="block" select="$date" />
		</xsl:call-template>

		<!-- Abstract -->
		<xsl:variable name="abstract">
			<xsl:apply-templates mode="elementFop"
				select="./gmd:identificationInfo/*/gmd:abstract">
				<xsl:with-param name="schema" select="$schema" />
			</xsl:apply-templates>
		</xsl:variable>
		<xsl:call-template name="blockElementFop">
			<xsl:with-param name="block" select="$abstract" />
		</xsl:call-template>

		<!-- Service Type -->
		<xsl:variable name="serviceType">
			<xsl:apply-templates mode="elementFop"
				select="./gmd:identificationInfo/*/srv:serviceType/gco:LocalName ">
				<xsl:with-param name="schema" select="$schema" />
			</xsl:apply-templates>
		</xsl:variable>
		<xsl:call-template name="blockElementFop">
			<xsl:with-param name="block" select="$serviceType" />
		</xsl:call-template>

		<!-- Service Type Version -->
		<xsl:variable name="srvVersion">
			<xsl:apply-templates mode="elementFop"
				select="./gmd:identificationInfo/*/srv:serviceTypeVersion">
				<xsl:with-param name="schema" select="$schema" />
			</xsl:apply-templates>
		</xsl:variable>
		<xsl:call-template name="blockElementFop">
			<xsl:with-param name="block" select="$srvVersion" />
		</xsl:call-template>

		<!-- Coupling Type -->
		<xsl:variable name="couplingType">
			<xsl:apply-templates mode="elementFop"
				select="./gmd:identificationInfo/*/srv:couplingType/srv:SV_CouplingType/@codeListValue">
				<xsl:with-param name="schema" select="$schema" />
			</xsl:apply-templates>
		</xsl:variable>
		<xsl:call-template name="blockElementFop">
			<xsl:with-param name="block" select="$couplingType" />
		</xsl:call-template>

		<!-- Code -->
		<xsl:variable name="code">
			<xsl:apply-templates mode="elementFop"
				select="gmd:identificationInfo/*/gmd:citation/gmd:CI_Citation/gmd:identifier/gmd:MD_Identifier/gmd:code">
				<xsl:with-param name="schema" select="$schema" />
			</xsl:apply-templates>
		</xsl:variable>
		<xsl:call-template name="blockElementFop">
			<xsl:with-param name="block" select="$code" />
		</xsl:call-template>

		<!-- Language -->
		<xsl:variable name="lang">
			<xsl:apply-templates mode="elementFop"
				select="./gmd:identificationInfo/*/gmd:language">
				<xsl:with-param name="schema" select="$schema" />
			</xsl:apply-templates>
		</xsl:variable>
		<xsl:call-template name="blockElementFop">
			<xsl:with-param name="block" select="$lang" />
		</xsl:call-template>

		<!-- Charset Encoding -->
		<xsl:variable name="lang">
			<xsl:apply-templates mode="elementFop"
				select="./gmd:identificationInfo/*/gmd:characterSet">
				<xsl:with-param name="schema" select="$schema" />
			</xsl:apply-templates>
		</xsl:variable>
		<xsl:call-template name="blockElementFop">
			<xsl:with-param name="block" select="$lang" />
		</xsl:call-template>

		<!-- Hierarchy Level -->
		<xsl:variable name="hierarchy">
			<xsl:apply-templates mode="elementFop"
				select="./gmd:hierarchyLevel/gmd:MD_ScopeCode/@codeListValue">
				<xsl:with-param name="schema" select="$schema" />
			</xsl:apply-templates>
		</xsl:variable>
		<xsl:call-template name="blockElementFop">
			<xsl:with-param name="block" select="$hierarchy" />
		</xsl:call-template>

		<!-- Source Online -->
		<xsl:variable name="online">
			<xsl:apply-templates mode="elementFop"
				select="./gmd:distributionInfo/gmd:MD_Distribution/gmd:transferOptions/gmd:MD_DigitalTransferOptions/gmd:onLine/gmd:CI_OnlineResource/gmd:linkage |
                                  ./gmd:distributionInfo/gmd:MD_Distribution/gmd:transferOptions/gmd:MD_DigitalTransferOptions/gmd:onLine/gmd:CI_OnlineResource/gmd:protocol">
				<xsl:with-param name="schema" select="$schema" />
			</xsl:apply-templates>
		</xsl:variable>
		<xsl:call-template name="blockElementFop">
			<xsl:with-param name="block" select="$online" />
			<xsl:with-param name="label">
				<xsl:value-of
					select="/root/gui/schemas/*[name()=$schema]/labels/element[@name='gmd:onLine']/label" />
			</xsl:with-param>
		</xsl:call-template>

		<!-- Contact -->
		<xsl:variable name="poc">
			<xsl:apply-templates mode="elementFop"
				select="./gmd:identificationInfo/*/gmd:pointOfContact/gmd:CI_ResponsibleParty/gmd:individualName    |
                                  ./gmd:identificationInfo/*/gmd:pointOfContact/gmd:CI_ResponsibleParty/gmd:organisationName  |
                                  ./gmd:identificationInfo/*/gmd:pointOfContact/gmd:CI_ResponsibleParty/gmd:positionName      |
                                  ./gmd:identificationInfo/*/gmd:pointOfContact/gmd:CI_ResponsibleParty/gmd:role/gmd:CI_RoleCode/@codeListValue">
				<xsl:with-param name="schema" select="$schema" />
			</xsl:apply-templates>
		</xsl:variable>
		<xsl:call-template name="blockElementFop">
			<xsl:with-param name="block" select="$poc" />
			<xsl:with-param name="label">
				<xsl:value-of
					select="/root/gui/schemas/*[name()=$schema]/labels/element[@name='gmd:pointOfContact']/label" />
			</xsl:with-param>
		</xsl:call-template>

		<!-- Topic category -->
		<xsl:variable name="topicCat">
			<xsl:apply-templates mode="elementFop"
				select="./gmd:identificationInfo/*/gmd:topicCategory">
				<xsl:with-param name="schema" select="$schema" />
			</xsl:apply-templates>
		</xsl:variable>
		<xsl:call-template name="blockElementFop">
			<xsl:with-param name="block" select="$topicCat" />
		</xsl:call-template>

		<!-- Keywords -->
		<xsl:variable name="keyword">
			<xsl:apply-templates mode="elementFop"
				select="./gmd:identificationInfo/*/gmd:descriptiveKeywords/gmd:MD_Keywords/gmd:keyword | 
              ./gmd:identificationInfo/*/gmd:descriptiveKeywords/gmd:MD_Keywords/gmd:type/gmd:MD_KeywordTypeCode/@codeListValue">
				<xsl:with-param name="schema" select="$schema" />
			</xsl:apply-templates>
		</xsl:variable>
		<xsl:call-template name="blockElementFop">
			<xsl:with-param name="block" select="$keyword" />
			<xsl:with-param name="label">
				<xsl:value-of
					select="/root/gui/schemas/*[name()=$schema]/labels/element[@name='gmd:keyword']/label" />
			</xsl:with-param>
		</xsl:call-template>

		<!-- Geographical extent -->
		<xsl:variable name="geoDesc">
			<xsl:apply-templates mode="elementFop"
				select="./gmd:identificationInfo/*/gmd:extent/gmd:EX_Extent/gmd:description |
                ./gmd:identificationInfo/*/srv:extent/gmd:EX_Extent/gmd:description">
				<xsl:with-param name="schema" select="$schema" />
			</xsl:apply-templates>
		</xsl:variable>
		<xsl:variable name="geoBbox">
			<xsl:apply-templates mode="elementFop"
				select="./gmd:identificationInfo/*/gmd:extent/gmd:EX_Extent/gmd:geographicElement/gmd:EX_GeographicBoundingBox |
              ./gmd:identificationInfo/*/srv:extent/gmd:EX_Extent/gmd:geographicElement/gmd:EX_GeographicBoundingBox">
				<xsl:with-param name="schema" select="$schema" />
			</xsl:apply-templates>
		</xsl:variable>
		<xsl:variable name="timeExtent">
			<xsl:apply-templates mode="elementFop"
				select="./gmd:identificationInfo/*/gmd:extent/gmd:EX_Extent/gmd:temporalElement/gmd:EX_TemporalExtent/gmd:extent/gml:TimeInstant/gml:timePosition">
				<xsl:with-param name="schema" select="$schema" />
			</xsl:apply-templates>
		</xsl:variable>
		<xsl:variable name="geoExtent">
			<xsl:call-template name="blockElementFop">
				<xsl:with-param name="block" select="$geoDesc" />
			</xsl:call-template>
			<xsl:call-template name="blockElementFop">
				<xsl:with-param name="block" select="$geoBbox" />
				<xsl:with-param name="label">
					<xsl:value-of
						select="/root/gui/schemas/*[name()=$schema]/labels/element[@name='gmd:EX_GeographicBoundingBox']/label" />
				</xsl:with-param>
			</xsl:call-template>
			<xsl:call-template name="blockElementFop">
				<xsl:with-param name="block" select="$timeExtent" />
				<xsl:with-param name="label">
					<xsl:value-of
						select="/root/gui/schemas/*[name()=$schema]/labels/element[@name='gmd:temporalElement']/label" />
				</xsl:with-param>
			</xsl:call-template>
		</xsl:variable>
		<xsl:call-template name="blockElementFop">
			<xsl:with-param name="block" select="$geoExtent" />
			<xsl:with-param name="label">
				<xsl:value-of
					select="/root/gui/schemas/*[name()=$schema]/labels/element[@name='gmd:EX_Extent']/label" />
			</xsl:with-param>
		</xsl:call-template>

		<!-- Spatial resolution -->
		<xsl:variable name="spatialResolution">
			<xsl:apply-templates mode="elementFop"
				select="./gmd:identificationInfo/*/gmd:spatialResolution">
				<xsl:with-param name="schema" select="$schema" />
			</xsl:apply-templates>
		</xsl:variable>
		<xsl:call-template name="blockElementFop">
			<xsl:with-param name="block" select="$spatialResolution" />
			<xsl:with-param name="label">
				<xsl:value-of
					select="/root/gui/schemas/*[name()=$schema]/labels/element[@name='gmd:spatialResolution']/label" />
			</xsl:with-param>
		</xsl:call-template>

		<!-- "Généalogie" -->
		<xsl:if
			test="./gmd:identificationInfo/*[name(.)!='srv:SV_ServiceIdentification']">
			<xsl:variable name="qual">
				<xsl:apply-templates mode="elementFop"
					select="./gmd:dataQualityInfo/gmd:DQ_DataQuality/gmd:lineage/gmd:LI_Lineage/gmd:statement">
					<xsl:with-param name="schema" select="$schema" />
				</xsl:apply-templates>
				<xsl:apply-templates mode="elementFop"
					select="./gmd:dataQualityInfo/gmd:DQ_DataQuality/gmd:lineage/gmd:LI_Lineage/gmd:source">
					<xsl:with-param name="schema" select="$schema" />
				</xsl:apply-templates>
			</xsl:variable>
			<xsl:call-template name="blockElementFop">
				<xsl:with-param name="block" select="$qual" />
				<xsl:with-param name="label">
					<xsl:value-of
						select="/root/gui/schemas/*[name()=$schema]/labels/element[@name='gmd:lineage']/label" />
				</xsl:with-param>
			</xsl:call-template>
		</xsl:if>

		<!-- Constraints -->
		<xsl:variable name="constraints">
			<xsl:apply-templates mode="elementFop"
				select="./gmd:identificationInfo/*/gmd:resourceConstraints/*/gmd:useLimitation/gco:CharacterString">
				<xsl:with-param name="schema" select="$schema" />
			</xsl:apply-templates>

			<xsl:apply-templates mode="elementFop"
				select="./gmd:identificationInfo/*/gmd:resourceConstraints/*/gmd:classification">
				<xsl:with-param name="schema" select="$schema" />
			</xsl:apply-templates>
		</xsl:variable>
		<xsl:call-template name="blockElementFop">
			<xsl:with-param name="block" select="$constraints" />
			<xsl:with-param name="label">
				<xsl:value-of
					select="/root/gui/schemas/*[name()=$schema]/labels/element[@name='gmd:resourceConstraints']/label" />
			</xsl:with-param>
		</xsl:call-template>

		<!-- Identifier -->
		<xsl:variable name="identifier">
			<xsl:apply-templates mode="elementFop" select="./gmd:fileIdentifier">
				<xsl:with-param name="schema" select="$schema" />
			</xsl:apply-templates>
		</xsl:variable>
		<xsl:call-template name="blockElementFop">
			<xsl:with-param name="block" select="$identifier" />
		</xsl:call-template>

		<!-- Language -->
		<xsl:variable name="language">
			<xsl:apply-templates mode="elementFop" select="./gmd:language">
				<xsl:with-param name="schema" select="$schema" />
			</xsl:apply-templates>
		</xsl:variable>
		<xsl:call-template name="blockElementFop">
			<xsl:with-param name="block" select="$language" />
		</xsl:call-template>

		<!-- Encoding -->
		<xsl:variable name="charset">
			<xsl:apply-templates mode="elementFop"
				select="./gmd:characterSet/gmd:MD_CharacterSetCode/@codeListValue">
				<xsl:with-param name="schema" select="$schema" />
			</xsl:apply-templates>
		</xsl:variable>
		<xsl:call-template name="blockElementFop">
			<xsl:with-param name="block" select="$charset" />
		</xsl:call-template>

		<!-- Contact -->
		<xsl:variable name="contact">
			<xsl:apply-templates mode="elementFop"
				select="./gmd:contact/gmd:CI_ResponsibleParty/gmd:individualName">
				<xsl:with-param name="schema" select="$schema" />
			</xsl:apply-templates>
			<xsl:apply-templates mode="elementFop"
				select="./gmd:contact/gmd:CI_ResponsibleParty/gmd:organisationName">
				<xsl:with-param name="schema" select="$schema" />
			</xsl:apply-templates>
			<xsl:apply-templates mode="elementFop"
				select="./gmd:contact/gmd:CI_ResponsibleParty/gmd:role/gmd:CI_RoleCode/@codeListValue">
				<xsl:with-param name="schema" select="$schema" />
			</xsl:apply-templates>
		</xsl:variable>
		<xsl:call-template name="blockElementFop">
			<xsl:with-param name="block" select="$contact" />
			<xsl:with-param name="label">
				<xsl:value-of
					select="/root/gui/schemas/*[name()=$schema]/labels/element[@name='gmd:contact' and not(@context)]/label" />
			</xsl:with-param>
		</xsl:call-template>

		<!-- Date stamp -->
		<xsl:variable name="dateStamp">
			<xsl:apply-templates mode="elementFop" select="./gmd:dateStamp">
				<xsl:with-param name="schema" select="$schema" />
			</xsl:apply-templates>
		</xsl:variable>
		<xsl:call-template name="blockElementFop">
			<xsl:with-param name="block" select="$dateStamp" />
		</xsl:call-template>

		<!-- Conformance -->
		<xsl:if
			test="gmd:dataQualityInfo/gmd:DQ_DataQuality/gmd:report/gmd:DQ_DomainConsistency/gmd:result/gmd:DQ_ConformanceResult[contains(gmd:specification/gmd:CI_Citation/gmd:title/gco:CharacterString, 'INSPIRE')]">
			<xsl:variable name="conf">
				<xsl:apply-templates mode="elementFop"
					select="./gmd:dataQualityInfo/gmd:DQ_DataQuality/gmd:report/gmd:DQ_DomainConsistency/gmd:result/gmd:DQ_ConformanceResult/gmd:specification/gmd:CI_Citation/gmd:title">
					<xsl:with-param name="schema" select="$schema" />
				</xsl:apply-templates>
				<xsl:apply-templates mode="elementFop"
					select="./gmd:dataQualityInfo/gmd:DQ_DataQuality/gmd:report/gmd:DQ_DomainConsistency/gmd:result/gmd:DQ_ConformanceResult/gmd:specification/gmd:CI_Citation/gmd:date/gmd:CI_Date/gmd:date">
					<xsl:with-param name="schema" select="$schema" />
				</xsl:apply-templates>
				<xsl:apply-templates mode="elementFop"
					select="./gmd:dataQualityInfo/gmd:DQ_DataQuality/gmd:report/gmd:DQ_DomainConsistency/gmd:result/gmd:DQ_ConformanceResult/gmd:specification/gmd:CI_Citation/gmd:date/gmd:CI_Date/gmd:dateType/gmd:CI_DateTypeCode/@codeListValue">
					<xsl:with-param name="schema" select="$schema" />
				</xsl:apply-templates>
				<xsl:apply-templates mode="elementFop"
					select="./gmd:dataQualityInfo/gmd:DQ_DataQuality/gmd:report/gmd:DQ_DomainConsistency/gmd:result/gmd:DQ_ConformanceResult/gmd:explanation">
					<xsl:with-param name="schema" select="$schema" />
				</xsl:apply-templates>
				<xsl:apply-templates mode="elementFop"
					select="./gmd:dataQualityInfo/gmd:DQ_DataQuality/gmd:report/gmd:DQ_DomainConsistency/gmd:result/gmd:DQ_ConformanceResult/gmd:pass">
					<xsl:with-param name="schema" select="$schema" />
				</xsl:apply-templates>
			</xsl:variable>
			<xsl:call-template name="blockElementFop">
				<xsl:with-param name="block" select="$conf" />
				<xsl:with-param name="label">
					INSPIRE
				</xsl:with-param>
			</xsl:call-template>
		</xsl:if>

	</xsl:template>

	<xsl:template name="Wmetadata-fop-iso19139">
		<xsl:param name="schema" />

		<xsl:call-template name="newBlock">
			<xsl:with-param name="title" select="'Identificatie'" />
			<xsl:with-param name="content">
				<!-- Title -->
				<xsl:apply-templates mode="elementFop"
					select="./gmd:identificationInfo/*/gmd:citation/gmd:CI_Citation/gmd:title">
					<xsl:with-param name="schema" select="$schema" />
				</xsl:apply-templates>
				<!-- Date -->
				<xsl:apply-templates mode="elementFop"
					select="./gmd:identificationInfo/*/gmd:citation/gmd:CI_Citation/gmd:date/gmd:CI_Date/gmd:date |
	                ./gmd:identificationInfo/*/gmd:citation/gmd:CI_Citation/gmd:date/gmd:CI_Date/gmd:dateType/gmd:CI_DateTypeCode/@codeListValue">
					<xsl:with-param name="schema" select="$schema" />
				</xsl:apply-templates>
				<xsl:apply-templates mode="elementFop"
					select="./gmd:identificationInfo/*/gmd:citation/gmd:CI_Citation/gmd:edition">
					<xsl:with-param name="schema" select="$schema" />
				</xsl:apply-templates>
				<!-- Service Type -->
				<xsl:apply-templates mode="elementFop"
					select="./gmd:identificationInfo/*/srv:serviceType/gco:LocalName ">
					<xsl:with-param name="schema" select="$schema" />
				</xsl:apply-templates>

				<!-- Service Type Version -->
				<xsl:apply-templates mode="elementFop"
					select="./gmd:identificationInfo/*/srv:serviceTypeVersion">
					<xsl:with-param name="schema" select="$schema" />
				</xsl:apply-templates>

				<!-- Coupling Type -->
				<xsl:apply-templates mode="elementFop"
					select="./gmd:identificationInfo/*/srv:couplingType/srv:SV_CouplingType/@codeListValue">
					<xsl:with-param name="schema" select="$schema" />
				</xsl:apply-templates>
				<!-- Code -->
				<xsl:apply-templates mode="elementFop"
					select="gmd:identificationInfo/*/gmd:citation/gmd:CI_Citation/gmd:identifier/gmd:MD_Identifier/gmd:code">
					<xsl:with-param name="schema" select="$schema" />
				</xsl:apply-templates>
			</xsl:with-param>
		</xsl:call-template>


		<xsl:call-template name="newBlock">
			<xsl:with-param name="title" select="'Inhoud'" />
			<xsl:with-param name="content">
				<!-- Abstract -->
				<xsl:apply-templates mode="elementFop"
					select="./gmd:identificationInfo/*/gmd:abstract">
					<xsl:with-param name="schema" select="$schema" />
				</xsl:apply-templates>

				<!-- Purpose -->
				<xsl:apply-templates mode="elementFop"
					select="./gmd:identificationInfo/*/gmd:purpose">
					<xsl:with-param name="schema" select="$schema" />
				</xsl:apply-templates>

				<!-- Status -->
				<xsl:apply-templates mode="elementFop"
					select="./gmd:identificationInfo/*/gmd:status">
					<xsl:with-param name="schema" select="$schema" />
				</xsl:apply-templates>

				<!-- Contactpoints -->
				<xsl:for-each select="./gmd:identificationInfo/*/gmd:pointOfContact">
					<xsl:call-template name="newBlock">
						<xsl:with-param name="title"
							select="'Contactgegevens dataset(serie)'" />
						<xsl:with-param name="content">
							<xsl:apply-templates mode="orgName" select=".">
								<xsl:with-param name="schema" select="$schema" />
							</xsl:apply-templates>
							</xsl:with-param>
					</xsl:call-template>
				</xsl:for-each>
				
				<!-- Keywords -->
				<xsl:for-each select="./gmd:identificationInfo/*/gmd:descriptiveKeywords">
					<xsl:apply-templates mode="elementFop"
						select="./gmd:MD_Keywords">
						<xsl:with-param name="schema" select="$schema" />
					</xsl:apply-templates>
				</xsl:for-each>
							
				<!-- Toepassing -->
				<xsl:call-template name="newBlock">
					<xsl:with-param name="title"
						select="'Toepassing'" />
					<xsl:with-param name="content">
						<xsl:apply-templates mode="elementFop"
						select="./gmd:identificationInfo/*/gmd:resourceSpecificUsage/gmd:MD_Usage">
							<xsl:with-param name="schema" select="$schema" />
						</xsl:apply-templates>
					</xsl:with-param>
				</xsl:call-template>
				
				<!-- Verwante dataset(series) -->
				<xsl:for-each select="./gmd:identificationInfo/*/gmd:aggregationInfo">
					<xsl:call-template name="newBlock">
						<xsl:with-param name="title"
							select="'Verwante dataset(serie)s'" />
						<xsl:with-param name="content">
							<xsl:apply-templates mode="elementFop"
								select="./gmd:MD_AggregateInformation">
								<xsl:with-param name="schema" select="$schema" />
							</xsl:apply-templates>
						</xsl:with-param>							
					</xsl:call-template>
				</xsl:for-each>
				
				
				<xsl:apply-templates mode="elementFop"
						select="./gmd:identificationInfo/*/gmd:spatialRepresentationType">
					<xsl:with-param name="schema" select="$schema" />
				</xsl:apply-templates>									
							
				<xsl:call-template name="newBlock">
					<xsl:with-param name="title"
						select="'Ruimtelijke resolutie dataset(serie)'" />
					<xsl:with-param name="content">
						<xsl:apply-templates mode="elementFop"
								select="./gmd:identificationInfo/*/gmd:spatialResolution/gmd:MD_Resolution/gmd:equivalentScale/gmd:MD_RepresentativeFraction">
							<xsl:with-param name="schema" select="$schema" />
						</xsl:apply-templates>		
					</xsl:with-param>
					
				</xsl:call-template>
		
				<!-- Language -->
				<xsl:apply-templates mode="elementFop"
					select="./gmd:identificationInfo/*/gmd:language">
					<xsl:with-param name="schema" select="$schema" />
				</xsl:apply-templates>
				
				<!-- Charset Encoding -->
				<xsl:apply-templates mode="elementFop"
					select="./gmd:identificationInfo/*/gmd:characterSet">
					<xsl:with-param name="schema" select="$schema" />
				</xsl:apply-templates>
				
				<!-- Hierarchy Level -->
				<xsl:apply-templates mode="elementFop"
					select="./gmd:hierarchyLevel/gmd:MD_ScopeCode/@codeListValue">
					<xsl:with-param name="schema" select="$schema" />
				</xsl:apply-templates>
				
				<!-- Extent -->				
				<xsl:call-template name="newBlock">
					<xsl:with-param name="title"
						select="'Begrenzing'" />
					<xsl:with-param name="content">
					
						 <xsl:apply-templates mode="elementFop"
							select="./gmd:identificationInfo/*/gmd:extent/gmd:EX_Extent/gmd:description 
										| ./gmd:identificationInfo/*/srv:extent/gmd:EX_Extent/gmd:description">
							<xsl:with-param name="schema" select="$schema" />
						</xsl:apply-templates>

						<xsl:call-template name="newBlock">
							<xsl:with-param name="title"
								select="'Omschrijvende rechthoek'" />
							<xsl:with-param name="content">						
								
				 				<xsl:apply-templates mode="elementFop"
									select="./gmd:identificationInfo/*/gmd:extent/gmd:EX_Extent/gmd:geographicElement">
									<xsl:with-param name="schema" select="$schema" />
								</xsl:apply-templates>
							</xsl:with-param>
						</xsl:call-template>

						<xsl:call-template name="newBlock">
							<xsl:with-param name="title"
								select="'Omschrijvende rechthoek'" />	
							<xsl:with-param name="content">				
								<xsl:apply-templates mode="elementFop"
									select="./gmd:identificationInfo/*/gmd:extent/gmd:EX_Extent/gmd:temporalElement">
									<xsl:with-param name="schema" select="$schema" />
								</xsl:apply-templates>
							</xsl:with-param>
						</xsl:call-template>
								
					</xsl:with-param>
				</xsl:call-template>
			
				<xsl:apply-templates mode="elementFop"
					select="./gmd:identificationInfo/*/gmd:supplementalInformation">
					<xsl:with-param name="schema" select="$schema" />
				</xsl:apply-templates>
				
			</xsl:with-param>
		</xsl:call-template>
				
		<xsl:for-each select="./gmd:referenceSystemInfo">
			<xsl:call-template name="newBlock">
				<xsl:with-param name="title"
					select="'Horizontaal en/of verticaal referentiesysteem'" />	
				<xsl:with-param name="content">	
				<xsl:apply-templates mode="elementFop" select=".">
					<xsl:with-param name="schema" select="$schema" />
				</xsl:apply-templates>
				</xsl:with-param>
			</xsl:call-template>		
		</xsl:for-each>
			
		<xsl:apply-templates mode="blockedFop" select="./gmd:dataQualityInfo">
			<xsl:with-param name="schema" select="$schema"/>
			<xsl:with-param name="blockHeaders">gmd:DQ_DataQuality|gmd:scope|gmd:report|gmd:DQ_ThematicClassificationCorrectness|gmd:DQ_QuantitativeResult|gmd:DQ_QualitativeResult|
			gmd:lineage|gmd:description|gmd:statement|gmd:processStep|gmd:processor
			</xsl:with-param>
			<xsl:with-param name="skipTags">gmd:DQ_DomainConsistency</xsl:with-param>
		</xsl:apply-templates>			
				
		<xsl:apply-templates mode="blockedFop" select="./gmd:dataQualityInfo/gmd:DQ_DataQuality/gmd:report/gmd:DQ_DomainConsistency">
			<xsl:with-param name="schema" select="$schema"/>
		</xsl:apply-templates>			
		
		<xsl:call-template name="newBlock"> <xsl:with-param name="title" select="'Gebruiksrecht'" /> <xsl:with-param name="content">
				<xsl:apply-templates mode="elementFop" select="./gmd:identificationInfo/*/gmd:resourceConstraints/gmd:MD_Constraints">
					<xsl:with-param name="schema" select="$schema" />
				</xsl:apply-templates>
				
				<xsl:call-template name="newBlock"> <xsl:with-param name="title" select="'Legale beperkingen voor toegang en gebruik'" /> <xsl:with-param name="content">
					<xsl:apply-templates mode="elementFop" select="./gmd:identificationInfo/*/gmd:resourceConstraints/gmd:MD_LegalConstraints">
						<xsl:with-param name="schema" select="$schema" />
					</xsl:apply-templates>
				</xsl:with-param> </xsl:call-template>
			</xsl:with-param>	
		</xsl:call-template>
				
		<xsl:call-template name="newBlock"> <xsl:with-param name="title" select="'Distributie'" /> <xsl:with-param name="content">
			<xsl:apply-templates mode="blockedFop" select="./gmd:distributionInfo">
				<xsl:with-param name="schema" select="$schema"/>
				<xsl:with-param name="blockHeaders">gmd:distributionFormat|gmd:distributor|gmd:distributionOrderProcess|gmd:transferOptions|
				gmd:onLine|gmd:name</xsl:with-param>
			</xsl:apply-templates>			
		</xsl:with-param></xsl:call-template>
		
		
		<xsl:call-template name="newBlock"> <xsl:with-param name="title" select="'Meta-metadata'" /> <xsl:with-param name="content">
			<xsl:apply-templates mode="elementFop"
				select="./gmd:fileIdentifier">
				<xsl:with-param name="schema" select="$schema" />
			</xsl:apply-templates>
		
			<xsl:apply-templates mode="elementFop"
				select="./gmd:language">
				<xsl:with-param name="schema" select="$schema" />
			</xsl:apply-templates>
		
			<xsl:apply-templates mode="elementFop"
				select="./gmd:characterSet">
				<xsl:with-param name="schema" select="$schema" />
			</xsl:apply-templates>
		
			<xsl:apply-templates mode="elementFop"
				select="./gmd:parentIdentifier">
				<xsl:with-param name="schema" select="$schema" />
			</xsl:apply-templates>
		
			<xsl:apply-templates mode="elementFop"
				select="./gmd:hierarchyLevel">
				<xsl:with-param name="schema" select="$schema" />
			</xsl:apply-templates>
		
			<xsl:apply-templates mode="elementFop"
				select="./gmd:dateStamp">
				<xsl:with-param name="schema" select="$schema" />
			</xsl:apply-templates>
		
			<xsl:apply-templates mode="elementFop"
				select="./gmd:metadataStandardName">
				<xsl:with-param name="schema" select="$schema" />
			</xsl:apply-templates>
		
			<xsl:apply-templates mode="elementFop"
				select="./gmd:metadataStandardVersion">
				<xsl:with-param name="schema" select="$schema" />
			</xsl:apply-templates>
		
			<xsl:apply-templates mode="orgName"
				select="./gmd:contact">
				<xsl:with-param name="schema" select="$schema" />
			</xsl:apply-templates>
		
		</xsl:with-param></xsl:call-template>
		
		<xsl:call-template name="newBlock"> <xsl:with-param name="title" select="'Objectencatalogus'" /> <xsl:with-param name="content">
			<xsl:apply-templates mode="elementFop"
				select="./gmd:contentInfo/gmd:MD_FeatureCatalogueDescription/gmd:includedWithDataset">
				<xsl:with-param name="schema" select="$schema" />
			</xsl:apply-templates>
			
			<xsl:call-template name="newBlock"> <xsl:with-param name="title" select="'Objectencatalogus citatie'" /> <xsl:with-param name="content">
			<xsl:apply-templates mode="elementFop"
				select="./gmd:contentInfo/gmd:MD_FeatureCatalogueDescription/gmd:featureCatalogueCitation/gmd:CI_Citation/gmd:title">
				<xsl:with-param name="schema" select="$schema" />
			</xsl:apply-templates>
			<xsl:apply-templates mode="elementFop"
				select="./gmd:contentInfo/gmd:MD_FeatureCatalogueDescription/gmd:featureCatalogueCitation/@uuidref">
				<xsl:with-param name="schema" select="$schema" />
			</xsl:apply-templates>
			</xsl:with-param></xsl:call-template>
		</xsl:with-param></xsl:call-template>
		
	</xsl:template>

	<xsl:template mode="orgName" match="*">
		<xsl:param name="schema" />
	
		<xsl:apply-templates mode="elementFop"
			select="./gmd:CI_ResponsibleParty/gmd:individualName |
					./gmd:CI_ResponsibleParty/gmd:organisationName  |
		            ./gmd:CI_ResponsibleParty/gmd:positionName">
			<xsl:with-param name="schema" select="$schema" />
		</xsl:apply-templates>
	
		<!-- Role -->
		<xsl:apply-templates mode="elementFop"
			select="./gmd:CI_ResponsibleParty/gmd:role">
			<xsl:with-param name="schema" select="$schema" />
		</xsl:apply-templates>
	
		<!-- Contact -->
		<xsl:apply-templates mode="elementFop"
			select="./gmd:CI_ResponsibleParty/gmd:contactInfo">
			<xsl:with-param name="schema" select="$schema" />
		</xsl:apply-templates>

 	</xsl:template>

</xsl:stylesheet>
