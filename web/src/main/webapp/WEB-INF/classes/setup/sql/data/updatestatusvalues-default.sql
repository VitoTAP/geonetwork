--ALTER TABLE metadatastatus DROP CONSTRAINT metadatastatus_statusid_fkey;
--ALTER TABLE StatusValues DROP CONSTRAINT statusvalues_pk;
DELETE FROM statusvaluesdes;
DELETE FROM StatusValues;

INSERT INTO StatusValues VALUES  ('0','unknown','y');
INSERT INTO StatusValues VALUES  ('6','justcreated','y');
INSERT INTO StatusValues VALUES  ('1','draft','y');
INSERT INTO StatusValues VALUES  ('4','submitted','y');
INSERT INTO StatusValues VALUES  ('2','approved','y');
INSERT INTO StatusValues VALUES  ('5','rejected','y');
INSERT INTO StatusValues VALUES  ('3','retired','y');
--INSERT INTO StatusValues VALUES  ('12','removed','y');

INSERT INTO statusvaluesdes VALUES ('0','dut','Onbekend');
INSERT INTO statusvaluesdes VALUES ('1','dut','Ontwerp');
INSERT INTO statusvaluesdes VALUES ('2','dut','Intern goedgekeurd en gepubliceerd');
INSERT INTO statusvaluesdes VALUES ('3','dut','Gedepubliceerd');
INSERT INTO statusvaluesdes VALUES ('4','dut','Intern ingediend');
INSERT INTO statusvaluesdes VALUES ('5','dut','Afgekeurd door Hoofdeditor');
INSERT INTO statusvaluesdes VALUES ('6','dut','Pas gecreëerd');
--INSERT INTO statusvaluesdes VALUES ('12','dut','Verwijderd');
INSERT INTO StatusValuesDes VALUES ('0','eng','Unknown');
INSERT INTO StatusValuesDes VALUES ('1','eng','Draft');
INSERT INTO StatusValuesDes VALUES ('2','eng','Approved');
INSERT INTO StatusValuesDes VALUES ('3','eng','Retired');
INSERT INTO StatusValuesDes VALUES ('4','eng','Submitted');
INSERT INTO StatusValuesDes VALUES ('5','eng','Rejected');
INSERT INTO StatusValuesDes VALUES ('6','eng','Just created');

ALTER TABLE StatusValues ADD CONSTRAINT statusvalues_pk PRIMARY KEY(id);
ALTER TABLE metadatastatus ADD CONSTRAINT metadatastatus_statusid_fkey FOREIGN KEY (statusid) REFERENCES statusvalues (id);
