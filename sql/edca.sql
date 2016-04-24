
/* CONTRATING PROCESS */
create table ContractingProcess (
	id serial primary key, 
	fecha_creacion date, 
	hora_creacion time
	);


/* ORGANIZATION TYPE */
CREATE TABLE OrganizationType (
    id serial primary key,
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


create table PlanningDocuments (
	id serial primary key, 
	contractingprocess_id int references contractingprocess(id),
	planning_id int references planning(id), 
	document_type text,
	title text, 
	description text, 
	url text, 
	date_published timestamp, 
	date_modified timestamp, 
	format text, 
	language text 
	);

create table Budget (
	id serial primary key, 
	contractingprocess_id int references contractingprocess(id), 
	planning_id int references planning(id), 
	budget_source text, 
	budget_description text, 
	budget_amount decimal, 
	budget_currency text, 
	budget_project text, 
	budget_projectID text, 
	budget_uri text, 
	rationale text 
	);

create table BudgetDocuments (
	id serial primary key, 
	contractingprocess_id int references contractingprocess(id), 
	budget_id int references budget(id), 
	document_type text, 
	title text, 
	description text, 
	url text, 
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
	/*  no necesarios */
	/*identifier_scheme text, 
	identifier_legalname text, 
	identifier_uri text,  */
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

/* TENDER (licitación) */
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
	numberoftenderers int
	/*, 
	amendment_date timestamp,
	amendment_rationale text*/
	);

create table TenderDocuments (
	id serial primary key, 
	contractingprocess_id int references contractingprocess(id), 
	tender_id int references Tender(id), 
	document_type text, 
	title text, 
	description text, 
	url text, 
	date_published timestamp, 
	date_modified timestamp, 
	format text, 
	language text 
	);

/* Tenderer (Organization) */
create table Tenderer(
	id serial primary key,
	ContractingProcess_id int references ContractingProcess(id),
	Tender_id int references Tender(id),
	name text,
	/*identifier_scheme text, 
	identifier_legalname text, 
	identifier_uri text,  */
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
	/*identifier_scheme text, 
	identifier_legalname text, 
	identifier_uri text,  */
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

create table TenderMilestone(
	id serial primary key,
	contractingprocess_id int references ContractingProcess(id),
	tender_id int references Tender(id),
	title text,
	description text,
	duedate timestamp, 
	date_modified timestamp,
	status text
);

create table TenderMilestoneDocuments(
	id serial primary key, 
	contractingprocess_id int references contractingprocess(id), 
	tender_id int references Tender(id), 
	milestone_id int references TenderMilestone(id),
	document_type text, 
	title text, 
	description text, 
	url text, 
	date_published timestamp, 
	date_modified timestamp, 
	format text, 
	language text 
);


create table TenderItem(
	id serial primary key,
	contractingprocess_id int references ContractingProcess(id),
	description text,
	/*classification... */
	quantity int,
	unit_name text, 
	unit_value_amount decimal,
	unit_value_currency text
);

create table TenderItemAdditionalClassifications(
	id serial primary key,
	contractingprocess_id int references ContractingProcess(id),
	tenderitem_id int references TenderItem(id),
	scheme text,
	description text,
	uri text
);


create table TenderAmendment(
	id serial primary key,
	contractingprocess_id int references ContractingProcess(id),
	tender_id int references TenderItem(id),
	amendment_date timestamp,
	rationale text
); 

create table TenderAmendmentChanges(
	id serial primary key, 
	contractingprocess_id int references ContractingProcess(id), 
	tenderamendment_id int references TenderAmendment(id),
	property text, 
	former_value text
);


/* AWARD (Adjudicación) */
create table Award(
	id serial primary key,
	contractingprocess_id int references ContractingProcess(id),
	title text,
	description text,
	status text,
	award_date timestamp,
	value_amount decimal,
	value_currency text,
	contractperiod_startdate timestamp,
	contractperiod_enddate timestamp
); /*remover -> amendment*/

create table AwardDocument(
	id serial primary key,
	contractingprocess_id int references ContractingProcess(id),
	award_id int references Award(id), 
	document_type text, 
	title text, 
	description text, 
	url text, 
	date_published timestamp, 
	date_modified timestamp, 
	format text, 
	language text 
);


/* Supplier (Organization) */
create table Supplier(
	id serial primary key,
	contractingprocess_id int references ContractingProcess(id), 
	award_id int references Award(id),
	name text,
	/*identifier_scheme text, 
	identifier_legalname text, 
	identifier_uri text,  */
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



create table SupplierAdditionalIdentifiers(
	id serial primary key, 
	contractingprocess int references ContractingProcess(id),
	award_id int references Award(id), 
	supplier_id int references Supplier(id),
	scheme text, 
	legalname text, 
	uri text
);


create table AwardAmendment(
	id serial primary key,
	contractingprocess_id int references ContractingProcess(id),
	award_id int references Award(id),
	amendment_date timestamp,
	rationale text
);

create table AwardAmendmentChanges(
	id serial primary key, 
	contractingprocess_id int references ContractingProcess(id),
	award_id int references AwardAmendment(id), 
	awardamendment_id int references AwardAmendment(id),
	property text,
	former_value text
);

create table AwardItem(
	id serial primary key, 
	award_id int references Award(id),
	description text,
	/*classification... */
	quantity int,
	unit_name text, 
	unit_value_amount decimal,
	unit_value_currency text
);

create table AwardItemAdditionalClassifications(
	id serial primary key,
	award_id int references Award(id),
	awarditem_id int references AwardItem(id),
	scheme text,
	description text,
	uri text	
);


/* CONTRACT (Contratación) */
create table Contract(
	id serial primary key,
	contractingprocess_id int references ContractingProcess(id),
	title text,
	description text,
	status text, 
	period_startdate timestamp,
	period_enddate timestamp,
	value_amount decimal, 
	value_currency text,
	datesigned timestamp
	/* amendment ...*/
);

create table ContractDocuments(
	id serial primary key,
	contractingprocess_id int references ContractingProcess(id), 
	contract_id int references Contract(id),
	document_type text, 
	title text, 
	description text, 
	url text, 
	date_published timestamp, 
	date_modified timestamp, 
	format text, 
	language text 
); 

create table ContractItem(
	id serial primary key,
	contractingprocess_id int references ContractingProcess(id), 
	contract_id int references Contract(id),
	description text,
	/*classification... */
	quantity int,
	unit_name text, 
	unit_value_amount decimal,
	unit_value_currency text

);

create table ContractItemAdditionalClasifications(
	id serial primary key,
	contractingprocess_id int references ContractingProcess(id), 
	contract_id int references Contract(id),
	contractitem_id int references ContractItem(id),
	scheme text,
	description text,
	uri text
);

create table ContractAmendment(
	id serial primary key,
	contractingprocess_id int references ContractingProcess(id), 
	contract_id int references Contract(id),
	amendment_date timestamp,
	rationale text
);

create table ContractAmendmentChanges(
	id serial primary key,
	contractingprocess_id int references ContractingProcess(id), 
	contract_id int references Contract(id),
	contractamendment_id int references ContractAmendment(id),
	property text,
	former_value text
);

/* IMPLEMENTATION (Implementación)*/

create table Implementation(
	id serial primary key,
	contractingprocess_id int references ContractingProcess(id), 
	contract_id int references Contract(id)
);

create table ImplementationDocuments(
	id serial primary key,
	contractingprocess_id int references ContractingProcess(id), 
	contract_id int references Contract(id),
	implementation_id int references Implementation(id),
	document_type text, 
	title text, 
	description text, 
	url text, 
	date_published timestamp, 
	date_modified timestamp, 
	format text, 
	language text 
);


create table ImplementationTransactions(
	id serial primary key,
	contractingprocess_id int references ContractingProcess(id), 
	contract_id int references Contract(id),
	implementation_id int references Implementation(id),
	source text,
	implementation_date timestamp,
	value_amount decimal, 
	value_currency text,
	uri text
);
	
create table ProviderOrganization(
	id serial primary key,
	contractingprocess_id int references ContractingProcess(id), 
	contract_id int references Contract(id),
	implementation_id int references Implementation(id), 
	implementationtransaction_id int references ImplementationTransactions(id),
	scheme text,
	legalname text,
	uri text
	);
	
create table ReceiverOrganization(
	id serial primary key,
	contractingprocess_id int references ContractingProcess(id), 
	contract_id int references Contract(id),
	implementation_id int references Implementation(id), 
	implementationtransaction_id int references Implementation(id),
	scheme text,
	legalname text,
	uri text
	);

create table ImplementationMilestones(
	id serial primary key,
	contractingprocess_id int references ContractingProcess(id), 
	contract_id int references Contract(id),
	implementation_id int references Implementation(id), 
	title text,
	description text,
	duedate timestamp, 
	date_modified timestamp,
	status text
);

create table ImplementationMilestoneDocuments(
	id serial primary key,
	contractingprocess_id int references ContractingProcess(id), 
	contract_id int references Contract(id),
	implementation_id int references Implementation(id),
	document_type text, 
	title text, 
	description text, 
	url text, 
	date_published timestamp, 
	date_modified timestamp, 
	format text, 
	language text 
);

