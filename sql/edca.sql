
/* CONTRATING PROCESS */
create table ContractingProcess (
	id serial primary key, 
	fecha_creacion date, 
	hora_creacion time
	);


/* ORGANIZATION TYPE */
CREATE TABLE OrganizationType (
    id integer NOT NULL,
    name character varying(50)
);

insert into organizationtype (name) values ('Buyer');
insert into organizationtype (name) values ('Tenderer');
insert into organizationtype (name) values ('Supplier');
insert into organizationtype (name) values ('Procuring Entity');


/* PLANNING */
create table Planning (
	id serial primary key, 
	ContractingProcess_id int references ContractingProcess(id)
	);


create table PlanningDocument (
	id serial primary key, 
	contractingprocess_id int references contractingprocess(id),
	planning_id int references planning(id), 
	document_type text, title text, 
	description text, url text, 
	date_published timestamp, 
	date_modified timestamp, 
	format text, language text 
	);

create table budget (
	id serial primary key, 
	contractingprocess_id int references contractingprocess(id), 
	planning_id int references planning(id), budget_source text, 
	budget_description text, budget_amount decimal, 
	budget_currency text, budget_project text, 
	budget_projectID text, budget_uri text, rationale text 
	);

create table BudgetDocument (
	id serial primary key, 
	contractingprocess_id int references contractingprocess(id), 
	budget_id int references budget(id), 
	document_type text, title text, 
	description text, url text, 
	date_published timestamp, 
	date_modified timestamp, 
	format text, 
	language text 
	);

/* BUYER (organization) */
create table Buyer (
	id serial primary key, 
	contractingprocess_id int references ContractingProcess(id),
	name text,
	identifier_scheme text, 
	identifier_legalname text, 
	identifier_uri text,  
	address_streetaddres text, 
	address_locality text, 
	address_region text, 
	address_postalcode text, 
	address_contryname text,
	contactpoint_name text, 
	contactpoint_email text, 
	contactpoint_telephone text, 
	contactpoint_faxnumber text, 
	contactpoint_url text
	);


create table BuyerAdditionalIdentifiers(
	id serial primary key,
	contractingprocess_id int references ContractingProcess(id),
	buyer_id int references buyer(id),
	scheme text, 
	legalname text, 
	uri text
);

/* TENDER */
create table Tender(
	id serial primary key,
	ContractingProcess_id int references ContractingProcess(id),
	title text, 
	description text,
	status text,
	minvalue_amount decimal, 
	minvalue_currency text,
	value_amount decimal,
	value_currency text, 
	procurementmethod text,
	procurementmethod_rationale text,
	awardcriteria text, 
	awardcriteria_details text,
	submissionmethod text,
	submissionmethod_details text, 
	tenderperiod_startdate timestamp,
	tenderperiod_enddate timestamp,
	enquiryperiod_startdate timestamp, 
	enquiryperiod_enddate timestamp,
	hasenquiries int, 
	eligibilitycriteria text, 
	awardperiod_startdate timestamp,
	awardperiod_enddate timestamp,
	numberoftenderers int, 
	amendment_date timestamp,
	amendment_rationale text
	);

/* Tenderer (Organization) */
create table Tenderer(
	id serial primary key,
	ContractingProcess_id int references ContractingProcess(id),
	Tender_id int references Tender(id),
	name text,
	identifier_scheme text, 
	identifier_legalname text, 
	identifier_uri text,  
	address_streetaddres text, 
	address_locality text, 
	address_region text, 
	address_postalcode text, 
	address_contryname text,
	contactpoint_name text, 
	contactpoint_email text, 
	contactpoint_telephone text, 
	contactpoint_faxnumber text, 
	contactpoint_url text
	);

create table TendererAdditionalIdentifiers(
	id serial primary key,
	contractingprocess_id int references ContractingProcess(id),
	tenderer_id int references Tenderer(id),
	scheme text, 
	legalname text, 
	uri text
);

/* ProcuringEntity (organization) */
create table ProcuringEntity(
	id serial primary key, 
	ContractingProcess_id int references ContractingProcess(id),
	Tender_id int references Tender(id),
	name text,
	identifier_scheme text, 
	identifier_legalname text, 
	identifier_uri text,  
	address_streetaddres text, 
	address_locality text, 
	address_region text, 
	address_postalcode text, 
	address_contryname text,
	contactpoint_name text, 
	contactpoint_email text, 
	contactpoint_telephone text, 
	contactpoint_faxnumber text, 
	contactpoint_url text
	);

create table ProcuringEntityAdditionalIdentifiers(
	id serial primary key,
	contractingprocess_id int references ContractingProcess(id),
	prcuringentity_id int references ProcuringEntity(id),
	scheme text, 
	legalname text, 
	uri text
);

