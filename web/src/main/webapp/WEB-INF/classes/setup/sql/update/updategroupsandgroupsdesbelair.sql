update groups set name = 'BELAIR-RegisteredUsers' where id = '3';
update groups set name = 'BELAIR-DataProviders' where id = 'c0e11634_edd4_4da6_93de_4cc001857dfc';
delete from groupsdes where iddes = '3'; 
insert into groupsdes (iddes, langid, label) values ('3','eng','BELAIR-RegisteredUsers');
insert into groupsdes (iddes, langid, label) values ('3','dut','BELAIR-RegisteredUsers');
delete from groupsdes where iddes = 'c0e11634_edd4_4da6_93de_4cc001857dfc'; 
insert into groupsdes (iddes, langid, label) values ('c0e11634_edd4_4da6_93de_4cc001857dfc','eng','BELAIR-DataProviders');
insert into groupsdes (iddes, langid, label) values ('c0e11634_edd4_4da6_93de_4cc001857dfc','dut','BELAIR-DataProviders');

