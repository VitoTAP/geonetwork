<?xml version="1.0" encoding="UTF-8"?>
<!--
  XSL for metadata controls (ie. buttons +, -, up, down actions)
  TODO : remove some JS dependencies eg. setBunload 
  -->
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:gmd="http://www.isotc211.org/2005/gmd"
  xmlns:gco="http://www.isotc211.org/2005/gco"
  xmlns:exslt="http://exslt.org/common" xmlns:str="http://exslt.org/strings"
  xmlns:geonet="http://www.fao.org/geonetwork" exclude-result-prefixes="exslt geonet str">

  <xsl:template name="getButtons">
    <xsl:param name="addLink"/>
    <xsl:param name="addXMLFragment"/>
    <xsl:param name="addXmlFragmentSubTemplate"/>
    <xsl:param name="removeLink"/>
    <xsl:param name="upLink"/>
    <xsl:param name="downLink"/>
    <xsl:param name="validationLink"/>
    <xsl:param name="id"/>


    <span class="buttons" id="buttons_{$id}">
      <!-- 
				add as remote XML fragment button when relevant -->
      <xsl:if test="normalize-space($addXMLFragment)">
        <xsl:variable name="xlinkTokens" select="tokenize($addXMLFragment,'!')"/>
        <xsl:text> </xsl:text>
        <xsl:choose>
          <xsl:when test="normalize-space($xlinkTokens[2])">
            <a id="addXlink_{$id}" class="small find"
              onclick="if (noDoubleClick()) {$xlinkTokens[1]}" style="display:none;">
              <span>&#160;</span>
            </a>
          </xsl:when>
          <xsl:otherwise>
            <a id="addXlink_{$id}" class="small find" onclick="{$addXMLFragment}"
              style="cursor:pointer;" alt="{/root/gui/strings/addXMLFragment}"
              title="{/root/gui/strings/addXMLFragment}">
              <span>&#160;</span>
            </a>
          </xsl:otherwise>
        </xsl:choose>
      </xsl:if>

      <!-- 
	      add as remote XML fragment button when relevant -->
      <xsl:if test="normalize-space($addXmlFragmentSubTemplate)">
        <xsl:variable name="xlinkTokens" select="tokenize($addXmlFragmentSubTemplate,'!')"/>
        <xsl:text> </xsl:text>
        <xsl:choose>
          <xsl:when test="normalize-space($xlinkTokens[2])">
            <a id="addXlink_{$id}" class="small find"
              onclick="if (noDoubleClick()) {$xlinkTokens[1]}" style="display:none;">
              <span>&#160;</span>
            </a>
          </xsl:when>
          <xsl:otherwise>
            <a id="addXlink_{$id}" class="small findsub" onclick="{$addXmlFragmentSubTemplate}"
              style="cursor:pointer;" alt="{/root/gui/strings/addXMLFragment}"
              title="{/root/gui/strings/addXMLFragment}">
              <span>&#160;</span>
            </a>
          </xsl:otherwise>
        </xsl:choose>
      </xsl:if>

      <!-- add button -->
      <xsl:choose>
        <xsl:when test="normalize-space($addLink)">
          <xsl:variable name="linkTokens" select="tokenize($addLink,'!')"/>
          <xsl:text> </xsl:text>
          <xsl:choose>
            <xsl:when test="normalize-space($linkTokens[2])">
              <a id="add_{$id}" class="small add" onclick="if (noDoubleClick()) {$linkTokens[1]}"
                target="_blank" alt="{/root/gui/strings/add[not(@js)]}" title="{/root/gui/strings/add[not(@js)]}"
                style="display:none;">
                <span>&#160;</span>
              </a>
            </xsl:when>
            <xsl:otherwise>
              <a id="add_{$id}" class="small add" onclick="if (noDoubleClick()) {$addLink}"
                target="_blank" alt="{/root/gui/strings/add[not(@js)]}" title="{/root/gui/strings/add[not(@js)]}">
                <span>&#160;</span>
              </a>
            </xsl:otherwise>
          </xsl:choose>
        </xsl:when>
        <xsl:otherwise>
          <span id="add_{$id}"/>
        </xsl:otherwise>
      </xsl:choose>


      <!-- remove button -->
	<xsl:variable name="fileName" select="gmd:fileName/gco:CharacterString"/>
	<xsl:variable name="fileDescr" select="gmd:MD_BrowseGraphic/gmd:fileDescription/gco:CharacterString"/>
	<xsl:variable name="isUploadedThumb" select="(string($fileDescr)='large_thumbnail' or string($fileDescr)='thumbnail') and contains($fileName,concat('http://',/root/gui/env/server/host))"/>
      <xsl:choose>
        <xsl:when test="normalize-space($removeLink) and (name(.)!='gmd:graphicOverview' or not($isUploadedThumb))">
          <xsl:variable name="linkTokens" select="tokenize($removeLink,'!')"/>
          <xsl:text> </xsl:text>
          <xsl:choose>
            <xsl:when test="normalize-space($linkTokens[2]) and 
                    not(starts-with(name(.), 'dc:')) and not(starts-with(name(.), 'dct:'))">
              <a id="remove_{$id}" class="small del" onclick="if (noDoubleClick()) {$linkTokens[1]}"
                target="_blank" alt="{/root/gui/strings/del}" title="{/root/gui/strings/del}"
                style="display:none;">
                <span>&#160;</span>
              </a>
            </xsl:when>
            <xsl:otherwise>
              <a id="remove_{$id}" class="small del" onclick="if (noDoubleClick()) {$removeLink}"
                target="_blank" alt="{/root/gui/strings/del}" title="{/root/gui/strings/del}">
                <span>&#160;</span>
              </a>
            </xsl:otherwise>
          </xsl:choose>
        </xsl:when>
        <xsl:otherwise>
          <span id="remove_{$id}"/>
        </xsl:otherwise>
      </xsl:choose>

      <!-- up button -->
      <xsl:choose>
        <xsl:when test="normalize-space($upLink)">
          <xsl:variable name="linkTokens" select="tokenize($upLink,'!')"/>
          <xsl:text> </xsl:text>
          <xsl:choose>
            <xsl:when test="normalize-space($linkTokens[2])">
              <a id="up_{$id}" class="small up" style="display:none"
                onclick="if (noDoubleClick()) {$linkTokens[1]}" target="_blank"
                alt="{/root/gui/strings/up}" title="{/root/gui/strings/up}">
                <span>&#160;</span>
              </a>
            </xsl:when>
            <xsl:otherwise>
              <a id="up_{$id}" class="small up" onclick="if (noDoubleClick()) {$upLink}"
                target="_blank" alt="{/root/gui/strings/up}" title="{/root/gui/strings/up}">
                <span>&#160;</span>
              </a>
            </xsl:otherwise>
          </xsl:choose>
        </xsl:when>
        <xsl:otherwise>
          <span id="up_{$id}"/>
        </xsl:otherwise>
      </xsl:choose>

      <!-- down button -->
      <xsl:choose>
        <xsl:when test="normalize-space($downLink)">
          <xsl:variable name="linkTokens" select="tokenize($downLink,'!')"/>
          <xsl:text> </xsl:text>
          <xsl:choose>
            <xsl:when test="normalize-space($linkTokens[2])">
              <a id="down_{$id}" class="small down" style="display:none;"
                onclick="if (noDoubleClick()) {$linkTokens[1]}" target="_blank"
                alt="{/root/gui/strings/down}" title="{/root/gui/strings/down}">
                <span>&#160;</span>
              </a>
            </xsl:when>
            <xsl:otherwise>
              <a id="down_{$id}" class="small down" onclick="if (noDoubleClick()) {$downLink}"
                target="_blank" alt="{/root/gui/strings/down}" title="{/root/gui/strings/down}">
                <span>&#160;</span>
              </a>
            </xsl:otherwise>
          </xsl:choose>
        </xsl:when>
        <xsl:otherwise>
          <span id="down_{$id}"/>
        </xsl:otherwise>
      </xsl:choose>
<!--
		<xsl:if test="name(.)='gmd:descriptiveKeywords'">
	        <xsl:text> </xsl:text>
	         <a id="keywordHelpLink_{$id}" class="small keyword" style="display:inline;" href="http://www.geopunt.be/~/media/Geopunt/Geowijzer/Metadata/documenten/GDI-Vlaanderen_Best_Practices_voor_Metadata-v1_0.pdf" target="_blank">
	              <span>&#160;</span>
	         </a>
		</xsl:if>
-->
      <!-- xsd and schematron validation error button -->
      <xsl:if test="normalize-space($validationLink)">
        <xsl:text> </xsl:text>
        <div style="display:block;" class="{normalize-space($validationLink)}" id="validation_{$id}"/>
<!-- 
        <a id="validationError{$id}" onclick="setBunload(false);"
          href="javascript:doEditorAlert(&quot;error_{$id}&quot;, &quot;errorimg_{$id}&quot;);" class="small error">
          <span>&#160;</span>
        </a>
        <div style="display:none;" class="toolTipOverlay" id="error_{$id}"
          onclick="this.style.display='none';">
          <xsl:copy-of select="$validationLink"/>
        </div>
-->
      </xsl:if>
    </span>
  </xsl:template>

  <!-- Template to display a calendar with a clear button -->
  <xsl:template name="calendar">
    <xsl:param name="schema"/>
    <xsl:param name="ref"/>
    <xsl:param name="parentId" />
    <xsl:param name="date"/>
    <xsl:param name="format" select="'%Y-%m-%d'"/>
    <xsl:param name="forceDateTime" select="false()"/>
    <xsl:param name="class" select="''"/>
	<xsl:variable name="name" select="name(.)"/>
	<xsl:variable name="tooltip">
        <xsl:call-template name="getLabelElementValue">
			<xsl:with-param name="name" select="$name"/>
			<xsl:with-param name="schema" select="$schema"/>
			<xsl:with-param name="elementName">mandatoryTooltip</xsl:with-param>			
        </xsl:call-template>
      </xsl:variable>
	<xsl:variable name="type">
        <xsl:call-template name="getLabelElementValue">
			<xsl:with-param name="name" select="$name"/>
			<xsl:with-param name="schema" select="$schema"/>
			<xsl:with-param name="elementName">mandatoryType</xsl:with-param>			
        </xsl:call-template>
    </xsl:variable>
    <table width="100%">
      <tr>
        <td>
          <xsl:if test="$class">
            <div class="cal {$class}" id="_{$ref}" forceDateTime="{$forceDateTime}" parentId="{$parentId}" agivmandatoryconfig="{{type: '{$type}', tooltip: '{$tooltip}'}}"/>
          </xsl:if>
          <xsl:if test="not($class)">
            <div class="cal" id="_{$ref}" forceDateTime="{$forceDateTime}" parentId="{$parentId}" agivmandatoryconfig="{{type: '{$type}', tooltip: '{$tooltip}'}}"/>
          </xsl:if>
          <xsl:if test="$forceDateTime or $class='dynamicDate'">
			<input type="hidden" name="{$parentId}" id="{$parentId}"/>
          </xsl:if>
          <input type="hidden" id="_{$ref}_format" value="{$format}"/>
          <input type="hidden" id="_{$ref}_cal" value="{$date}"/>
        </td>
      </tr>
    </table>
  </xsl:template>

  <!-- Template to display a calendar with a clear button -->
  <xsl:template name="combobox">
    <xsl:param name="ref"/>
	<xsl:param name="disabled"/>
	<xsl:param name="onchangeFunction"/>
	<xsl:param name="onchangeParams"/>
    <xsl:param name="onkeyupFunction"/>
	<xsl:param name="onkeyupParams"/>
    <xsl:param name="value"/>
    <xsl:param name="optionValues"/>
    <xsl:param name="optionLabels"/>

    <table width="100%">
      <tr>
        <td>
<!-- 		  <div class="combobox" id="_{$ref}" config="{{disabled: {$disabled}, onchange: {$onchange}, onkeyup: {$onkeyup}, optionValues: ['{$optionValues}'],optionLabels: ['{$optionLabels}']}}"/> -->
		  <div class="combobox" id="_{$ref}_combobox" config="{{onchangeFunction: '{$onchangeFunction}', onchangeParams: '{$onchangeParams}', onkeyupFunction: '{$onkeyupFunction}', onkeyupParams: '{$onkeyupParams}', optionValues: ['{$optionValues}'],optionLabels: ['{$optionLabels}']}}"/>
          <input type="hidden" name="_{$ref}" id="_{$ref}" value="{$value}"/>
        </td>
      </tr>
    </table>
  </xsl:template>

  <xsl:template name="thesaurusCombobox">
    <xsl:param name="ref"/>
	<xsl:param name="onchangeFunction"/>
	<xsl:param name="onchangeParams"/>
    <xsl:param name="onkeyupFunction"/>
	<xsl:param name="onkeyupParams"/>
    <xsl:param name="value"/>
    <xsl:param name="thesaurusId"/>
    <xsl:param name="thesaurusTitle"/>
		<div class="thesaurusInfo"><span class="title"><xsl:value-of select="$thesaurusTitle"/></span></div>
		<div class="thesaurusCombobox" id="_{$ref}_thesaurusCombobox" config="{{value: '{$value}', thesaurusId: '{$thesaurusId}',onchangeFunction: '{$onchangeFunction}', onchangeParams: '{$onchangeParams}', onkeyupFunction: '{$onkeyupFunction}', onkeyupParams: '{$onkeyupParams}'}}"/>
	    <textarea id="thesaurusCombobox_{$ref}_xml" name="_X{$ref}" rows="" cols="" class="debug">
	      <xsl:apply-templates mode="geonet-cleaner" select="."/>
	    </textarea>
  </xsl:template>
</xsl:stylesheet>
