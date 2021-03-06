//=============================================================================
//===	Copyright (C) 2001-2007 Food and Agriculture Organization of the
//===	United Nations (FAO-UN), United Nations World Food Programme (WFP)
//===	and United Nations Environment Programme (UNEP)
//===
//===	This program is free software; you can redistribute it and/or modify
//===	it under the terms of the GNU General Public License as published by
//===	the Free Software Foundation; either version 2 of the License, or (at
//===	your option) any later version.
//===
//===	This program is distributed in the hope that it will be useful, but
//===	WITHOUT ANY WARRANTY; without even the implied warranty of
//===	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
//===	General Public License for more details.
//===
//===	You should have received a copy of the GNU General Public License
//===	along with this program; if not, write to the Free Software
//===	Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301, USA
//===
//===	Contact: Jeroen Ticheler - FAO - Viale delle Terme di Caracalla 2,
//===	Rome - Italy. email: geonetwork@osgeo.org
//==============================================================================

package org.fao.geonet.services.metadata;

import jeeves.constants.Jeeves;
import jeeves.interfaces.Service;
import jeeves.resources.dbms.Dbms;
import jeeves.server.ServiceConfig;
import jeeves.server.context.ServiceContext;
import org.fao.geonet.GeonetContext;
import org.fao.geonet.constants.Geonet;
import org.fao.geonet.constants.Params;
import org.fao.geonet.kernel.AccessManager;
import org.fao.geonet.kernel.DataManager;
import org.fao.geonet.kernel.MdInfo;
import org.fao.geonet.lib.Lib;
import org.fao.geonet.services.Utils;
import org.jdom.Element;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

//=============================================================================

/**
 * Given a metadata id returns all associated status records. Called by the
 * metadata.status service
 */

public class GetStatus implements Service {
	// --------------------------------------------------------------------------
	// ---
	// --- Init
	// ---
	// --------------------------------------------------------------------------

	public void init(String appPath, ServiceConfig params) throws Exception {
	}

	// --------------------------------------------------------------------------
	// ---
	// --- Service
	// ---
	// --------------------------------------------------------------------------

	public Element exec(Element params, ServiceContext context)
			throws Exception {
		GeonetContext gc = (GeonetContext) context
				.getHandlerContext(Geonet.CONTEXT_NAME);
		DataManager dataMan = gc.getDataManager();
		AccessManager am = gc.getAccessManager();

		Dbms dbms = (Dbms) context.getResourceManager()
				.open(Geonet.Res.MAIN_DB);

		String id = Utils.getIdentifierFromParameters(params, context);

		// -----------------------------------------------------------------------
		// --- check access
		if (!dataMan.existsMetadata(dbms, id))
			throw new IllegalArgumentException("Metadata not found --> " + id);

		if (!am.isOwner(context, id))
			throw new IllegalArgumentException(
					"You are not the owner of metadata --> " + id);

		boolean isWorkspace = dataMan.existsMetadataInWorkspace(dbms, id);
		// -----------------------------------------------------------------------
		// --- retrieve metadata status

		Element stats = dataMan.getStatus(dbms, id);

		String status = Params.Status.UNKNOWN;
		String userId = "-1"; // no userId
		if (stats != null) {
			List<Element> mdStat = stats.getChildren();
			if (mdStat.size() > 0) {
				Element stat = mdStat.get(0);
				status = stat.getChildText("statusid");
				userId = stat.getChildText("userid");
			}
		}

		// -----------------------------------------------------------------------
		// --- retrieve status values

		Element elStatus = Lib.local.retrieve(dbms, "StatusValues");
		List<Element> kids = elStatus.getChildren();

		for (Element kid : kids) {

			kid.setName(Geonet.Elem.STATUS);

			// --- set status value of this metadata to 'on'

			if (kid.getChildText("id").equals(status)) {
				kid.addContent(new Element("on"));

				// --- set the userId of the submitter into the result
				kid.addContent(new Element("userId").setText(userId));
			}
		}

		// -----------------------------------------------------------------------
		// --- get the list of content reviewers for this metadata record

		Set<String> ids = new HashSet<String>();
		ids.add(id);

		Element cRevs = am.getContentHoofdeditors(dbms, ids);
		cRevs.setName("contentHoofdeditors");

		// -----------------------------------------------------------------------
		// --- put it all together

		Element elRes = new Element(Jeeves.Elem.RESPONSE)
				.addContent(new Element(Geonet.Elem.ID).setText(id))
				.addContent(elStatus).addContent(cRevs).addContent(new Element(Geonet.Elem.NODE_TYPE).setText(context.getServlet().getNodeType())).addContent(new Element(Geonet.Elem.STATUS).setText(status)).addContent(new Element(Geonet.Elem.IS_WORKSPACE).setText("" + isWorkspace));

		return elRes;
	}
}

// =============================================================================

