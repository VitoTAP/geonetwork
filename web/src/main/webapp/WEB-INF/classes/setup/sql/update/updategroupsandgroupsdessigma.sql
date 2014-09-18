update groups set name = 'SIGMA-RegisteredUsers' where id = '3';
update groups set name = 'SIGMA-DataProviders' where id = 'ef4f5134_7a7f_4ae1_9cc8_75f75cea539f';
delete from groupsdes where iddes = '3'; 
insert into groupsdes (iddes, langid, label) values ('3','eng','SIGMA-RegisteredUsers');
insert into groupsdes (iddes, langid, label) values ('3','dut','SIGMA-RegisteredUsers');
delete from groupsdes where iddes = 'ef4f5134_7a7f_4ae1_9cc8_75f75cea539f'; 
insert into groupsdes (iddes, langid, label) values ('ef4f5134_7a7f_4ae1_9cc8_75f75cea539f','eng','SIGMA-DataProviders');
insert into groupsdes (iddes, langid, label) values ('ef4f5134_7a7f_4ae1_9cc8_75f75cea539f','dut','SIGMA-DataProviders');


