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

package org.fao.geonet.services.thumbnail;

import jeeves.interfaces.Service;
import jeeves.resources.dbms.Dbms;
import jeeves.server.ServiceConfig;
import jeeves.server.context.ServiceContext;
import jeeves.utils.Util;
import lizard.tiff.Tiff;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.StringUtils;
import org.fao.geonet.GeonetContext;
import org.fao.geonet.constants.Geonet;
import org.fao.geonet.constants.Params;
import org.fao.geonet.kernel.DataManager;
import org.fao.geonet.lib.Lib;
import org.jdom.Element;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

/**
 * TODO Javadoc.
 */
public class    Set implements Service {
	//--------------------------------------------------------------------------
	//---
	//--- Init
	//---
	//--------------------------------------------------------------------------

	public void init(String appPath, ServiceConfig params) throws Exception {}

	//--------------------------------------------------------------------------
	//---
	//--- Service
	//---
	//--------------------------------------------------------------------------

    /**
     * TODO Javadoc. AGIV specific changes
     * 
     * @param params
     * @param context
     * @return
     * @throws Exception
     */
    public Element exec(Element params, ServiceContext context)
            throws Exception {
        String id = Util.getParam(params, Params.ID);
        // String type = Util.getParam(params, Params.TYPE);
        String file = Util.getParam(params, Params.FNAME);
        // boolean scaling = Util.getParam(params, Params.SCALING, false);

        // boolean createSmall = Util.getParam(params, Params.CREATE_SMALL,
        // false);
        // String smallScalingDir = Util.getParam(params,
        // Params.SMALL_SCALING_DIR, "");
        // int smallScalingFactor = Util.getParam(params,
        // Params.SMALL_SCALING_FACTOR, 0);

        Lib.resource.checkEditPrivilege(context, id);

        // -----------------------------------------------------------------------
        // --- environment vars

        GeonetContext gc = (GeonetContext) context
                .getHandlerContext(Geonet.CONTEXT_NAME);
        DataManager dataMan = gc.getDataManager();

        // -----------------------------------------------------------------------
        // --- create destination directory

        String dataDir = Lib.resource.getDir(context, Params.Access.PUBLIC, id);
        new File(dataDir).mkdirs();

        Double scalingFactor = -1d;//shouldScale(context.getUploadDir() + file);

        if (Math.abs(scalingFactor) > 1) { // We need to make it smaller
            String inFile = context.getUploadDir() + file;
            String outFile = dataDir + file;
            File outFile_ = new File(outFile);
            if(outFile_.exists()) {
                outFile_.delete();
            }
            String scalingDir = "width";
            if (scalingFactor < 0) {
                scalingDir = "height";
            }
            createThumbnail(inFile, outFile, 120, scalingDir);

            if (!new File(inFile).delete()) {
                context.error("Error while deleting thumbnail : " + inFile);
            }

            dataMan.setThumbnail(context, id, /*false*/true, file);
        } else {// Image of exactly 120x120. Big thumbnail, no scale
            // or image too small, just upload as it is (small thumbnail)
            File inFile = new File(context.getUploadDir() + file);
            File outFile = new File(dataDir, file);
            
            if(outFile.exists()) {
                outFile.delete();
            }
            
            try {
                FileUtils.moveFile(inFile, outFile);
            } catch (Exception e) {
                inFile.delete();
                throw new Exception(
                        "Unable to move uploaded thumbnail to destination: "
                                + outFile + ". Error: " + e.getMessage());
            }
            
            dataMan.setThumbnail(context, id, /*type.equals("small")*/true, file);
        }

        Element response = new Element("a");
        response.addContent(new Element("id").setText(id));

        return response;
    }

    /**
     * Check if image should be scaled (AGIV)
     * 
     * @param inFile
     * @return
     */
    private Double shouldScale(String inFile) {
        BufferedImage origImg;
        double maxSize = 200d;
        double scale = -1d;
        try {
            origImg = getImage(inFile);
            double imgWidth = origImg.getWidth();
            double imgHeight = origImg.getHeight();
            if (imgWidth > maxSize && imgWidth > imgHeight) {
                scale = imgWidth / maxSize;
            } else if (imgHeight > maxSize) {
                scale = -imgHeight / maxSize;
            } else if (imgWidth > imgHeight) {
                scale = imgWidth / maxSize;
            } else {
                scale = -imgHeight / maxSize;
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return scale;

    }

    /**
     * // FIXME : not elegant.
     *
     * TODO Javadoc.
     *
     * @param params
     * @param context
     * @param dbms
     * @param dataMan
     * @return
     * @throws Exception
     */
	public Element execOnHarvest(
							Element params, 
							ServiceContext context, 
							Dbms dbms, 
							DataManager dataMan) throws Exception {
		String  id            = Util.getParam     (params, Params.ID);
		String  type          = Util.getParam     (params, Params.TYPE);
		String  file          = Util.getParam     (params, Params.FNAME);
		String  scalingDir    = Util.getParam     (params, Params.SCALING_DIR, "width");
		boolean scaling       = Util.getParam     (params, Params.SCALING, false);
		int     scalingFactor = Util.getParam     (params, Params.SCALING_FACTOR, 1);
		
		boolean createSmall        = Util.getParam(params, Params.CREATE_SMALL,        false);
		String  smallScalingDir    = Util.getParam(params, Params.SMALL_SCALING_DIR,   "");
		int     smallScalingFactor = Util.getParam(params, Params.SMALL_SCALING_FACTOR, 0);
		
		String dataDir = Lib.resource.getDir(context, Params.Access.PUBLIC, id);
		
		if (!new File(dataDir).mkdirs())
			context.error("Failed to make dir: " + dataDir);
		
		//-----------------------------------------------------------------------
		//--- create the small thumbnail, removing the old one

		if (createSmall) {
			String smallFile = getFileName(file, true);
			String inFile    = context.getUploadDir() + file;
			String outFile   = dataDir + smallFile;
			// FIXME should be done before removeOldThumbnail(context, id, "small");
			createThumbnail(inFile, outFile, smallScalingFactor, smallScalingDir);
			dataMan.setThumbnail(context, id, true, smallFile);
		}

		//-----------------------------------------------------------------------
		//--- create the requested thumbnail, removing the old one
		// FIXME removeOldThumbnail(context, id, type);

		if (scaling) {
			String newFile = getFileName(file, type.equals("small"));
			String inFile  = context.getUploadDir() + file;
			String outFile = dataDir + newFile;

			createThumbnail(inFile, outFile, scalingFactor, scalingDir);

			if (!new File(inFile).delete())
				context.error("Error while deleting thumbnail : "+inFile);

			dataMan.setThumbnail(context, id, type.equals("small"), newFile);
		}
		else {
			//--- move uploaded file to destination directory
			File inFile  = new File(context.getUploadDir(), file);
			File outFile = new File(dataDir,                file);

			try {
				FileUtils.moveFile(inFile, outFile);
			} catch (Exception e) {
				inFile.delete();
				throw new Exception(
						"Unable to move uploaded thumbnail to destination: " + outFile + ". Error: " + e.getMessage());
			}

			dataMan.setThumbnail(context, id, type.equals("small"), file);
		}

		//-----------------------------------------------------------------------

		Element response = new Element("Response");
		response.addContent(new Element("id").setText(id));
		// NOT NEEDEDresponse.addContent(new Element("version").setText(dataMan.getNewVersion(id)));

		return response;
	}

	//--------------------------------------------------------------------------
	//---
	//--- Private methods
	//---
	//--------------------------------------------------------------------------

    /**
     * TODO javadoc.
     *
     * @param inFile
     * @param outFile
     * @param scalingFactor
     * @param scalingDir
     * @throws IOException
     */
	private void createThumbnail(String inFile, String outFile, int scalingFactor, String scalingDir) throws IOException {
		BufferedImage origImg = getImage(inFile);

		int imgWidth  = origImg.getWidth();
		int imgHeight = origImg.getHeight();

		int width;
		int height;

		if (scalingDir.equals("width"))
		{
			width  = scalingFactor;
			height = width * imgHeight / imgWidth;
		}
		else
		{
			height = scalingFactor;
			width  = height * imgWidth / imgHeight;
		}

		Image thumb = origImg.getScaledInstance(width, height, BufferedImage.SCALE_SMOOTH);

		BufferedImage bimg = new BufferedImage(width, height, BufferedImage.TRANSLUCENT);

		Graphics2D g = bimg.createGraphics();
		g.drawImage(thumb, 0, 0, null);
		g.dispose();

		ImageIO.write(bimg, IMAGE_TYPE, new File(outFile));
	}

    /**
     * TODO Javadoc.
     *
     * @param file
     * @param small
     * @return
     */
	private String getFileName(String file, boolean small) {
		int pos = file.lastIndexOf('.');

		if (pos != -1)
			file = file.substring(0, pos);

		return small 	? file + SMALL_SUFFIX +"."+ IMAGE_TYPE
							: file +"."+ IMAGE_TYPE;
	}

    /**
     * TODO Javadoc.
     *
     * @param inFile
     * @return
     * @throws IOException
     */
	public BufferedImage getImage(String inFile) throws IOException {
		String lcFile = inFile.toLowerCase();

		if (lcFile.endsWith(".tif") || lcFile.endsWith(".tiff"))
		{
			//--- load the TIFF/GEOTIFF file format

			Image image = getTiffImage(inFile);

			int width = image.getWidth(null);
			int height= image.getHeight(null);

			BufferedImage bimg = new BufferedImage(width, height, BufferedImage.TYPE_3BYTE_BGR);
			Graphics2D g = bimg.createGraphics();
			g.drawImage(image, 0,0, null);
			g.dispose();

			return bimg;
		}

		return ImageIO.read(new File(inFile));
	}

    /**
     * TODO Javadoc.
     *
     * @param inFile
     * @return
     * @throws IOException
     */
	private Image getTiffImage(String inFile) throws IOException {
		Tiff t = new Tiff();
		t.readInputStream(new FileInputStream(inFile));

		if (t.getPageCount() == 0)
			throw new IOException("No images inside TIFF file");

		return t.getImage(0);
	}

	//--------------------------------------------------------------------------
	//---
	//--- Variables
	//---
	//--------------------------------------------------------------------------

	private static final String IMAGE_TYPE   = "png";
	private static final String SMALL_SUFFIX = "_s";

}