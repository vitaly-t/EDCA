/* CONTRATING PROCESS */
drop table if exists ContractingProcess cascade;
create table ContractingProcess (
	id serial primary key,
    ocid text,
	fecha_creacion date,
	hora_creacion time,
	stage integer,
	uri text,
	publicationpolicy text,
	license text
	);

drop table if exists Publisher cascade;
create table Publisher (
	id serial primary key,
	contractingprocess_id int references ContractingProcess(id) on delete cascade,
	name   text,
    scheme text,
    uid   text,
    uri    text
	);

/* PLANNING */
drop table if exists Planning cascade;
create table Planning (
	id serial primary key, 
	ContractingProcess_id int references ContractingProcess(id) on delete cascade,
	rationale text
	);

drop table if exists PlanningDocuments cascade;
create table PlanningDocuments (
	id serial primary key, 
	contractingprocess_id int references contractingprocess(id) on delete cascade,	
	planning_id int references planning(id) on delete cascade,
	documentid text,
	document_type text,
	title text, 
	description text, 
	url text, 
	date_published timestamp, 
	date_modified timestamp, 
	format text, 
	language text 
	);

drop table if exists Budget cascade;
create table Budget (
	id serial primary key, 
	contractingprocess_id int references contractingprocess(id) on delete cascade, 
	planning_id int references planning(id) on delete cascade, 
	budget_source text,
	budget_budgetid text,
	budget_description text, 
	budget_amount decimal, 
	budget_currency text, 
	budget_project text, 
	budget_projectID text, 
	budget_uri text
	);

/* BUYER (organization) */
drop table if exists Buyer cascade;
create table Buyer (
	id serial primary key, 
	contractingprocess_id int references ContractingProcess(id) on delete cascade,
	name text,
	identifier_scheme text,
	identifier_id text,
	identifier_legalname text,
	identifier_uri text,
	address_streetaddress text,
	address_locality text, 
	address_region text, 
	address_postalcode text, 
	address_countryname text,
	contactpoint_name text, 
	contactpoint_email text, 
	contactpoint_telephone text, 
	contactpoint_faxnumber text, 
	contactpoint_url text
	);

drop table if exists BuyerAdditionalIdentifiers cascade;
create table BuyerAdditionalIdentifiers(
	id serial primary key,
	contractingprocess_id int references ContractingProcess(id) on delete cascade,
	buyer_id int references buyer(id) on delete cascade,
	scheme text, 
	legalname text, 
	uri text
);

/* TENDER (licitación) */
drop table if exists Tender cascade;
create table Tender(
	id serial primary key,
	ContractingProcess_id int references ContractingProcess(id) on delete cascade,
	tenderid text,
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

drop table if exists TenderDocuments cascade;
create table TenderDocuments (
	id serial primary key, 
	contractingprocess_id int references contractingprocess(id) on delete cascade, 
	tender_id int references Tender(id) on delete cascade, 
	document_type text,
	documentid text,
	title text, 
	description text, 
	url text, 
	date_published timestamp, 
	date_modified timestamp, 
	format text, 
	language text 
	);

/* Tenderer (Organization) */
drop table if exists Tenderer cascade;
create table Tenderer(
	id serial primary key,
	ContractingProcess_id int references ContractingProcess(id) on delete cascade,
	Tender_id int references Tender(id) on delete cascade,
	name text,
	identifier_scheme text,
	identifier_id text,
	identifier_legalname text, 
	identifier_uri text,
	address_streetaddress text,
	address_locality text, 
	address_region text, 
	address_postalcode text, 
	address_countryname text,
	contactpoint_name text, 
	contactpoint_email text, 
	contactpoint_telephone text, 
	contactpoint_faxnumber text, 
	contactpoint_url text
	);

drop table if exists TendererAdditionalIdentifiers cascade;
create table TendererAdditionalIdentifiers(
	id serial primary key,
	contractingprocess_id int references ContractingProcess(id) on delete cascade,
	tenderer_id int references Tenderer(id) on delete cascade,
	scheme text, 
	legalname text, 
	uri text
);

/* ProcuringEntity (organization) */

drop table if exists ProcuringEntity cascade;
create table ProcuringEntity(
	id serial primary key,
	ContractingProcess_id int references ContractingProcess(id) on delete cascade,
	Tender_id int references Tender(id) on delete cascade,
	identifier_scheme text,
	identifier_id text,
	identifier_legalname text,
	identifier_uri text,
    name text,
	address_streetaddress text,
	address_locality text,
	address_region text,
	address_postalcode text,
	address_countryname text,
	contactpoint_name text,
	contactpoint_email text,
	contactpoint_telephone text,
	contactpoint_faxnumber text,
	contactpoint_url text
	);

drop table if exists ProcuringEntityAdditionalIdentifiers cascade;
create table ProcuringEntityAdditionalIdentifiers(
	id serial primary key,
	contractingprocess_id int references ContractingProcess(id) on delete cascade,
	tender_id int references Tender(id) on delete cascade,
	procuringentity_id int references ProcuringEntity(id) on delete cascade,
	scheme text, 
	legalname text, 
	uri text
);

drop table if exists TenderMilestone cascade;
create table TenderMilestone(
	id serial primary key,
	contractingprocess_id int references ContractingProcess(id) on delete cascade,
	tender_id int references Tender(id) on delete cascade,
	milestoneid text,
	title text,
	description text,
	duedate timestamp, 
	date_modified timestamp,
	status text
);

drop table if exists TenderMilestoneDocuments cascade;
create table TenderMilestoneDocuments(
id serial primary key,
	contractingprocess_id int references contractingprocess(id) on delete cascade,
	tender_id int references Tender(id) on delete cascade,
	milestone_id int references TenderMilestone(id) on delete cascade,
	document_type text,
    documentid text,
	title text,
	description text,
	url text,
	date_published timestamp,
	date_modified timestamp,
	format text,
	language text
);

drop table if exists TenderItem cascade;
create table TenderItem(
	id serial primary key,
	contractingprocess_id int references ContractingProcess(id) on delete cascade,
	tender_id int references Tender(id) on delete cascade,
	itemid text,
	description text,
	classification_scheme text,
    classification_id text,
    classification_description text,
    classification_uri text,
	quantity int,
	unit_name text, 
	unit_value_amount decimal,
	unit_value_currency text
);

drop table if exists TenderItemAdditionalClassifications cascade;
create table TenderItemAdditionalClassifications(
	id serial primary key,
	contractingprocess_id int references ContractingProcess(id) on delete cascade,
	tenderitem_id int references TenderItem(id) on delete cascade,
	scheme text,
	description text,
	uri text
);


drop table if exists TenderAmendmentChanges cascade;
create table TenderAmendmentChanges(
	id serial primary key, 
	contractingprocess_id int references ContractingProcess(id) on delete cascade, 
	tender_id int references Tender(id) on delete cascade,
	property text, 
	former_value text
);


/* AWARD (Adjudicación) */
drop table if exists Award cascade;
create table Award(
	id serial primary key,
	contractingprocess_id int references ContractingProcess(id) on delete cascade,
	awardid text,
	title text,
	description text,
	status text,
	award_date timestamp,
	value_amount decimal,
	value_currency text,
	contractperiod_startdate timestamp,
	contractperiod_enddate timestamp,
	amendment_date timestamp,
    amendment_rationale text
);


drop table if exists AwardAmendmentChanges cascade;
create table AwardAmendmentChanges(
	id serial primary key,
	contractingprocess_id int references ContractingProcess(id) on delete cascade,
	award_id int references Award(id) on delete cascade,
	property text,
	former_value text
);




drop table if exists AwardDocuments cascade;
create table AwardDocuments(
	id serial primary key,
	contractingprocess_id int references ContractingProcess(id) on delete cascade,
	award_id int references Award(id) on delete cascade, 
	document_type text,
	documentid text,
	title text, 
	description text, 
	url text, 
	date_published timestamp, 
	date_modified timestamp, 
	format text, 
	language text 
);


/* Supplier (Organization) */
drop table if exists Supplier cascade;
create table Supplier(
	id serial primary key,
	contractingprocess_id int references ContractingProcess(id) on delete cascade, 
	award_id int references Award(id) on delete cascade,
	name text,
	identifier_scheme text,
	identifier_id text,
	identifier_legalname text, 
	identifier_uri text,
	address_streetaddress text,
	address_locality text, 
	address_region text, 
	address_postalcode text, 
	address_countryname text,
	contactpoint_name text, 
	contactpoint_email text, 
	contactpoint_telephone text, 
	contactpoint_faxnumber text, 
	contactpoint_url text
);


drop table if exists SupplierAdditionalIdentifiers cascade;
create table SupplierAdditionalIdentifiers(
	id serial primary key, 
	contractingprocess int references ContractingProcess(id) on delete cascade,
	award_id int references Award(id) on delete cascade, 
	supplier_id int references Supplier(id) on delete cascade,
	scheme text, 
	legalname text, 
	uri text
);

drop table if exists AwardItem cascade;
create table AwardItem(
	id serial primary key,
	contractingprocess_id int references ContractingProcess(id) on delete cascade,
	award_id int references Award(id) on delete cascade,
	itemid text,
	description text,
	classification_scheme text,
	classification_id text,
	classification_description text,
	classification_uri text,
	quantity int,
	unit_name text, 
	unit_value_amount decimal,
	unit_value_currency text
);

drop table if exists AwardItemAdditionalClassifications cascade;
create table AwardItemAdditionalClassifications(
	id serial primary key,
	award_id int references Award(id) on delete cascade,
	awarditem_id int references AwardItem(id) on delete cascade,
	scheme text,
	description text,
	uri text	
);


/* CONTRACT (Contratación) */
drop table if exists Contract cascade;
create table Contract(
	id serial primary key,
	contractingprocess_id int references ContractingProcess(id) on delete cascade,
	awardid text,
	contractid text,
	title text,
	description text,
	status text, 
	period_startdate timestamp,
	period_enddate timestamp,
	value_amount decimal, 
	value_currency text,
	datesigned timestamp,
	amendment_date timestamp,
	amendment_rationale text
);



drop table if exists ContractAmendmentChanges cascade;
create table ContractAmendmentChanges(
	id serial primary key,
	contractingprocess_id int references ContractingProcess(id) on delete cascade,
	contract_id int references Contract(id) on delete cascade,
	property text,
	former_value text
);


drop table if exists ContractDocuments cascade;
create table ContractDocuments(
	id serial primary key,
	contractingprocess_id int references ContractingProcess(id) on delete cascade,  
	contract_id int references Contract(id) on delete cascade,
	document_type text,
	 documentid text,
	title text, 
	description text, 
	url text, 
	date_published timestamp, 
	date_modified timestamp, 
	format text, 
	language text 
); 

drop table if exists ContractItem cascade;
create table ContractItem(
	id serial primary key,
	contractingprocess_id int references ContractingProcess(id) on delete cascade, 
	contract_id int references Contract(id) on delete cascade,
	itemid text,
	description text,
	classification_scheme text,
    classification_id text,
    classification_description text,
    classification_uri text,
	quantity int,
	unit_name text, 
	unit_value_amount decimal,
	unit_value_currency text

);

drop table if exists ContractItemAdditionalClasifications cascade;
create table ContractItemAdditionalClasifications(
	id serial primary key,
	contractingprocess_id int references ContractingProcess(id) on delete cascade, 
	contract_id int references Contract(id) on delete cascade,
	contractitem_id int references ContractItem(id) on delete cascade,
	scheme text,
	description text,
	uri text
);


/* IMPLEMENTATION (Implementación)*/
drop table if exists Implementation cascade;
create table Implementation(
	id serial primary key,
	contractingprocess_id int references ContractingProcess(id) on delete cascade, 
	contract_id int references Contract(id) on delete cascade
);

drop table if exists ImplementationDocuments cascade;
create table ImplementationDocuments(
	id serial primary key,
	contractingprocess_id int references ContractingProcess(id) on delete cascade, 
	contract_id int references Contract(id) on delete cascade,
	implementation_id int references Implementation(id) on delete cascade,
	document_type text,
	documentid text,
	title text, 
	description text, 
	url text, 
	date_published timestamp, 
	date_modified timestamp, 
	format text, 
	language text 
);

drop table if exists ImplementationTransactions cascade;
create table ImplementationTransactions(
	id serial primary key,
	contractingprocess_id int references ContractingProcess(id) on delete cascade, 
	contract_id int references Contract(id) on delete cascade,
	implementation_id int references Implementation(id) on delete cascade,
    transactionid text,
	source text,
	implementation_date timestamp,
	value_amount decimal, 
	value_currency text,

	providerorganization_scheme text,
	providerorganization_id text,
    providerorganization_legalname text,
    providerorganization_uri text,

    receiverorganization_scheme text,
    receiverorganization_id text,
    receiverorganization_legalname text,
    receiverorganization_uri text,

	uri text
);


drop table if exists ImplementationMilestone cascade;
create table ImplementationMilestone(
	id serial primary key,
	contractingprocess_id int references ContractingProcess(id) on delete cascade, 
	contract_id int references Contract(id) on delete cascade,
	implementation_id int references Implementation(id) on delete cascade,
	milestoneid text,
	title text,
	description text,
	duedate timestamp, 
	date_modified timestamp,
	status text
);


drop table if exists ImplementationMilestoneDocuments cascade;
create table ImplementationMilestoneDocuments(
	id serial primary key,
	contractingprocess_id int references ContractingProcess(id) on delete cascade,
	contract_id int references Contract(id) on delete cascade,
	implementation_id int references Implementation(id) on delete cascade,
	document_type text,
	documentid text,
	title text,
	description text,
	url text,
	date_published timestamp,
	date_modified timestamp,
	format text,
	language text
);


drop table if exists DocumentType;
create table DocumentType (
    id serial primary key,
    category text,
    code text,
    title text,
    description text,
    source text
);

insert into DocumentType("category", "code", "title", "description", "source") values
('basic','tenderNotice','Tender Notice','The formal notice that gives details of a tender. This may be a link to a downloadable document, to a web page, or to an official gazette in which the notice is contained.',''),
('basic','awardNotice','Award Notice','The formal notice that gives details of the contract award. This may be a link to a downloadable document, to a web page, or to an official gazette in which the notice is contained.',''),
('basic','contractNotice','Contract Notice','The formal notice that gives details of a contract being signed and valid to start implementation. This may be a link to a downloadable document, to a web page, or to an official gazette in which the notice is contained.',''),
('basic','completionCertificate','Completion certificate','',''),
('basic','procurementPlan','Procurement Plan','',''),
('basic','biddingDocuments','Bidding Documents','Information for potential suppliers, describing the goals of the contract (e.g. goods and services to be procured), and the bidding process.',''),
('basic','technicalSpecifications','Technical Specifications','Detailed technical information about goods or services to be provided.',''),
('basic','evaluationCriteria','Evaluation Criteria','Information about how bids will be evaluated.',''),
('intermediate','evaluationReports','Evaluation report','Report on the evaluation of the bids and the application of the evaluation criteria, including the justification fo the award',''),
('intermediate','contractSigned','Signed Contract','',''),
('intermediate','contractArrangements','Arrangements for ending contract','',''),
('intermediate','contractSchedule','Schedules and milestones','',''),
('intermediate','physicalProcessReport','Physical progress reports','A report on the status of implementation, usually against key milestones.',''),
('intermediate','financialProgressReport','Financial progress reports','Dates and amounts of stage payments made (against total amount) and the source of those payments, including cost overruns, if any. Structured versions of this data can be provided through transactions.',''),
('intermediate','finalAudit','Final Audit','',''),
('intermediate','hearingNotice','Public Hearing Notice','Details of any public hearings that took place as part of the planning for this procurement.',''),
('intermediate','marketStudies','Market Studies','',''),
('intermediate','eligibilityCriteria','Eligibility Criteria','Detailed documents about the eligibility of bidders.',''),
('intermediate','clarifications','Clarifications to bidders questions','Including replies to issues raised in pre-bid conferences.',''),
('intermediate','shortlistedFirms','Shortlisted Firms','',''),
('advanced','environmentalImpact','Environmental Impact','',''),
('advanced','assetAndLiabilityAssessment','Assesment of government’s assets and liabilities','',''),
('advanced','riskProvisions','Provisions for management of risks and liabilities','',''),
('advanced','winningBid','Winning Bid','',''),
('advanced','complaints','Complaints and decisions','',''),
('advanced','contractAnnexe','Annexes to the Contract','',''),
('advanced','contractGuarantees','Guarantees','',''),
('advanced','subContract','Subcontracts','A document detailing subcontracts, the subcontract itself, or a linked OCDS document describing a subcontract.',''),
('advanced','needsAssessment','Needs Assessment','',''),
('advanced','feasibilityStudy','Feasibility study','',''),
('advanced','projectPlan','Project plan','',''),
('advanced','billOfQuantity','Bill Of Quantity','',''),
('advanced','bidders','Information on bidders','Information on bidders or participants, their validation documents and any procedural exemptions for which they qualify',''),
('advanced','conflictOfInterest','conflicts of interest uncovered','',''),
('advanced','debarments','debarments issued','','');

drop table if exists currency cascade;
create table currency (
    id serial primary key,
    entity text,
    currency text,
    alphabetic_code text,
    numeric_code text,
    minor_unit text
);

insert into currency("entity","currency","alphabetic_code","numeric_code","minor_unit") values
('AFGHANISTAN','Afghani','AFN','971','2'),
('ÅLAND ISLANDS','Euro','EUR','978','2'),
('ALBANIA','Lek','ALL','008','2'),
('ALGERIA','Algerian Dinar','DZD','012','2'),
('AMERICAN SAMOA','US Dollar','USD','840','2'),
('ANDORRA','Euro','EUR','978','2'),
('ANGOLA','Kwanza','AOA','973','2'),
('ANGUILLA','East Caribbean Dollar','XCD','951','2'),
('ANTARCTICA','No universal currency','','',''),
('ANTIGUA AND BARBUDA','East Caribbean Dollar','XCD','951','2'),
('ARGENTINA','Argentine Peso','ARS','032','2'),
('ARMENIA','Armenian Dram','AMD','051','2'),
('ARUBA','Aruban Florin','AWG','533','2'),
('AUSTRALIA','Australian Dollar','AUD','036','2'),
('AUSTRIA','Euro','EUR','978','2'),
('AZERBAIJAN','Azerbaijanian Manat','AZN','944','2'),
('BAHAMAS (THE)','Bahamian Dollar','BSD','044','2'),
('BAHRAIN','Bahraini Dinar','BHD','048','3'),
('BANGLADESH','Taka','BDT','050','2'),
('BARBADOS','Barbados Dollar','BBD','052','2'),
('BELARUS','Belarusian Ruble','BYN','933','2'),
('BELARUS','Belarusian Ruble','BYR','974','0'),
('BELGIUM','Euro','EUR','978','2'),
('BELIZE','Belize Dollar','BZD','084','2'),
('BENIN','CFA Franc BCEAO','XOF','952','0'),
('BERMUDA','Bermudian Dollar','BMD','060','2'),
('BHUTAN','Indian Rupee','INR','356','2'),
('BHUTAN','Ngultrum','BTN','064','2'),
('BOLIVIA (PLURINATIONAL STATE OF)','Boliviano','BOB','068','2'),
('BOLIVIA (PLURINATIONAL STATE OF)','Mvdol','BOV','984','2'),
('BONAIRE, SINT EUSTATIUS AND SABA','US Dollar','USD','840','2'),
('BOSNIA AND HERZEGOVINA','Convertible Mark','BAM','977','2'),
('BOTSWANA','Pula','BWP','072','2'),
('BOUVET ISLAND','Norwegian Krone','NOK','578','2'),
('BRAZIL','Brazilian Real','BRL','986','2'),
('BRITISH INDIAN OCEAN TERRITORY (THE)','US Dollar','USD','840','2'),
('BRUNEI DARUSSALAM','Brunei Dollar','BND','096','2'),
('BULGARIA','Bulgarian Lev','BGN','975','2'),
('BURKINA FASO','CFA Franc BCEAO','XOF','952','0'),
('BURUNDI','Burundi Franc','BIF','108','0'),
('CABO VERDE','Cabo Verde Escudo','CVE','132','2'),
('CAMBODIA','Riel','KHR','116','2'),
('CAMEROON','CFA Franc BEAC','XAF','950','0'),
('CANADA','Canadian Dollar','CAD','124','2'),
('CAYMAN ISLANDS (THE)','Cayman Islands Dollar','KYD','136','2'),
('CENTRAL AFRICAN REPUBLIC (THE)','CFA Franc BEAC','XAF','950','0'),
('CHAD','CFA Franc BEAC','XAF','950','0'),
('CHILE','Chilean Peso','CLP','152','0'),
('CHILE','Unidad de Fomento','CLF','990','4'),
('CHINA','Yuan Renminbi','CNY','156','2'),
('CHRISTMAS ISLAND','Australian Dollar','AUD','036','2'),
('COCOS (KEELING) ISLANDS (THE)','Australian Dollar','AUD','036','2'),
('COLOMBIA','Colombian Peso','COP','170','2'),
('COLOMBIA','Unidad de Valor Real','COU','970','2'),
('COMOROS (THE)','Comoro Franc','KMF','174','0'),
('CONGO (THE DEMOCRATIC REPUBLIC OF THE)','Congolese Franc','CDF','976','2'),
('CONGO (THE)','CFA Franc BEAC','XAF','950','0'),
('COOK ISLANDS (THE)','New Zealand Dollar','NZD','554','2'),
('COSTA RICA','Costa Rican Colon','CRC','188','2'),
('CÔTE D''IVOIRE','CFA Franc BCEAO','XOF','952','0'),
('CROATIA','Kuna','HRK','191','2'),
('CUBA','Cuban Peso','CUP','192','2'),
('CUBA','Peso Convertible','CUC','931','2'),
('CURAÇAO','Netherlands Antillean Guilder','ANG','532','2'),
('CYPRUS','Euro','EUR','978','2'),
('CZECH REPUBLIC (THE)','Czech Koruna','CZK','203','2'),
('DENMARK','Danish Krone','DKK','208','2'),
('DJIBOUTI','Djibouti Franc','DJF','262','0'),
('DOMINICA','East Caribbean Dollar','XCD','951','2'),
('DOMINICAN REPUBLIC (THE)','Dominican Peso','DOP','214','2'),
('ECUADOR','US Dollar','USD','840','2'),
('EGYPT','Egyptian Pound','EGP','818','2'),
('EL SALVADOR','El Salvador Colon','SVC','222','2'),
('EL SALVADOR','US Dollar','USD','840','2'),
('EQUATORIAL GUINEA','CFA Franc BEAC','XAF','950','0'),
('ERITREA','Nakfa','ERN','232','2'),
('ESTONIA','Euro','EUR','978','2'),
('ETHIOPIA','Ethiopian Birr','ETB','230','2'),
('EUROPEAN UNION','Euro','EUR','978','2'),
('FALKLAND ISLANDS (THE) [MALVINAS]','Falkland Islands Pound','FKP','238','2'),
('FAROE ISLANDS (THE)','Danish Krone','DKK','208','2'),
('FIJI','Fiji Dollar','FJD','242','2'),
('FINLAND','Euro','EUR','978','2'),
('FRANCE','Euro','EUR','978','2'),
('FRENCH GUIANA','Euro','EUR','978','2'),
('FRENCH POLYNESIA','CFP Franc','XPF','953','0'),
('FRENCH SOUTHERN TERRITORIES (THE)','Euro','EUR','978','2'),
('GABON','CFA Franc BEAC','XAF','950','0'),
('GAMBIA (THE)','Dalasi','GMD','270','2'),
('GEORGIA','Lari','GEL','981','2'),
('GERMANY','Euro','EUR','978','2'),
('GHANA','Ghana Cedi','GHS','936','2'),
('GIBRALTAR','Gibraltar Pound','GIP','292','2'),
('GREECE','Euro','EUR','978','2'),
('GREENLAND','Danish Krone','DKK','208','2'),
('GRENADA','East Caribbean Dollar','XCD','951','2'),
('GUADELOUPE','Euro','EUR','978','2'),
('GUAM','US Dollar','USD','840','2'),
('GUATEMALA','Quetzal','GTQ','320','2'),
('GUERNSEY','Pound Sterling','GBP','826','2'),
('GUINEA','Guinea Franc','GNF','324','0'),
('GUINEA-BISSAU','CFA Franc BCEAO','XOF','952','0'),
('GUYANA','Guyana Dollar','GYD','328','2'),
('HAITI','Gourde','HTG','332','2'),
('HAITI','US Dollar','USD','840','2'),
('HEARD ISLAND AND McDONALD ISLANDS','Australian Dollar','AUD','036','2'),
('HOLY SEE (THE)','Euro','EUR','978','2'),
('HONDURAS','Lempira','HNL','340','2'),
('HONG KONG','Hong Kong Dollar','HKD','344','2'),
('HUNGARY','Forint','HUF','348','2'),
('ICELAND','Iceland Krona','ISK','352','0'),
('INDIA','Indian Rupee','INR','356','2'),
('INDONESIA','Rupiah','IDR','360','2'),
('INTERNATIONAL MONETARY FUND (IMF) ','SDR (Special Drawing Right)','XDR','960','N.A.'),
('IRAN (ISLAMIC REPUBLIC OF)','Iranian Rial','IRR','364','2'),
('IRAQ','Iraqi Dinar','IQD','368','3'),
('IRELAND','Euro','EUR','978','2'),
('ISLE OF MAN','Pound Sterling','GBP','826','2'),
('ISRAEL','New Israeli Sheqel','ILS','376','2'),
('ITALY','Euro','EUR','978','2'),
('JAMAICA','Jamaican Dollar','JMD','388','2'),
('JAPAN','Yen','JPY','392','0'),
('JERSEY','Pound Sterling','GBP','826','2'),
('JORDAN','Jordanian Dinar','JOD','400','3'),
('KAZAKHSTAN','Tenge','KZT','398','2'),
('KENYA','Kenyan Shilling','KES','404','2'),
('KIRIBATI','Australian Dollar','AUD','036','2'),
('KOREA (THE DEMOCRATIC PEOPLE’S REPUBLIC OF)','North Korean Won','KPW','408','2'),
('KOREA (THE REPUBLIC OF)','Won','KRW','410','0'),
('KUWAIT','Kuwaiti Dinar','KWD','414','3'),
('KYRGYZSTAN','Som','KGS','417','2'),
('LAO PEOPLE’S DEMOCRATIC REPUBLIC (THE)','Kip','LAK','418','2'),
('LATVIA','Euro','EUR','978','2'),
('LEBANON','Lebanese Pound','LBP','422','2'),
('LESOTHO','Loti','LSL','426','2'),
('LESOTHO','Rand','ZAR','710','2'),
('LIBERIA','Liberian Dollar','LRD','430','2'),
('LIBYA','Libyan Dinar','LYD','434','3'),
('LIECHTENSTEIN','Swiss Franc','CHF','756','2'),
('LITHUANIA','Euro','EUR','978','2'),
('LUXEMBOURG','Euro','EUR','978','2'),
('MACAO','Pataca','MOP','446','2'),
('MACEDONIA (THE FORMER YUGOSLAV REPUBLIC OF)','Denar','MKD','807','2'),
('MADAGASCAR','Malagasy Ariary','MGA','969','2'),
('MALAWI','Malawi Kwacha','MWK','454','2'),
('MALAYSIA','Malaysian Ringgit','MYR','458','2'),
('MALDIVES','Rufiyaa','MVR','462','2'),
('MALI','CFA Franc BCEAO','XOF','952','0'),
('MALTA','Euro','EUR','978','2'),
('MARSHALL ISLANDS (THE)','US Dollar','USD','840','2'),
('MARTINIQUE','Euro','EUR','978','2'),
('MAURITANIA','Ouguiya','MRO','478','2'),
('MAURITIUS','Mauritius Rupee','MUR','480','2'),
('MAYOTTE','Euro','EUR','978','2'),
('MEMBER COUNTRIES OF THE AFRICAN DEVELOPMENT BANK GROUP','ADB Unit of Account','XUA','965','N.A.'),
('MEXICO','Mexican Peso','MXN','484','2'),
('MEXICO','Mexican Unidad de Inversion (UDI)','MXV','979','2'),
('MICRONESIA (FEDERATED STATES OF)','US Dollar','USD','840','2'),
('MOLDOVA (THE REPUBLIC OF)','Moldovan Leu','MDL','498','2'),
('MONACO','Euro','EUR','978','2'),
('MONGOLIA','Tugrik','MNT','496','2'),
('MONTENEGRO','Euro','EUR','978','2'),
('MONTSERRAT','East Caribbean Dollar','XCD','951','2'),
('MOROCCO','Moroccan Dirham','MAD','504','2'),
('MOZAMBIQUE','Mozambique Metical','MZN','943','2'),
('MYANMAR','Kyat','MMK','104','2'),
('NAMIBIA','Namibia Dollar','NAD','516','2'),
('NAMIBIA','Rand','ZAR','710','2'),
('NAURU','Australian Dollar','AUD','036','2'),
('NEPAL','Nepalese Rupee','NPR','524','2'),
('NETHERLANDS (THE)','Euro','EUR','978','2'),
('NEW CALEDONIA','CFP Franc','XPF','953','0'),
('NEW ZEALAND','New Zealand Dollar','NZD','554','2'),
('NICARAGUA','Cordoba Oro','NIO','558','2'),
('NIGER (THE)','CFA Franc BCEAO','XOF','952','0'),
('NIGERIA','Naira','NGN','566','2'),
('NIUE','New Zealand Dollar','NZD','554','2'),
('NORFOLK ISLAND','Australian Dollar','AUD','036','2'),
('NORTHERN MARIANA ISLANDS (THE)','US Dollar','USD','840','2'),
('NORWAY','Norwegian Krone','NOK','578','2'),
('OMAN','Rial Omani','OMR','512','3'),
('PAKISTAN','Pakistan Rupee','PKR','586','2'),
('PALAU','US Dollar','USD','840','2'),
('PALESTINE, STATE OF','No universal currency','','',''),
('PANAMA','Balboa','PAB','590','2'),
('PANAMA','US Dollar','USD','840','2'),
('PAPUA NEW GUINEA','Kina','PGK','598','2'),
('PARAGUAY','Guarani','PYG','600','0'),
('PERU','Sol','PEN','604','2'),
('PHILIPPINES (THE)','Philippine Peso','PHP','608','2'),
('PITCAIRN','New Zealand Dollar','NZD','554','2'),
('POLAND','Zloty','PLN','985','2'),
('PORTUGAL','Euro','EUR','978','2'),
('PUERTO RICO','US Dollar','USD','840','2'),
('QATAR','Qatari Rial','QAR','634','2'),
('RÉUNION','Euro','EUR','978','2'),
('ROMANIA','Romanian Leu','RON','946','2'),
('RUSSIAN FEDERATION (THE)','Russian Ruble','RUB','643','2'),
('RWANDA','Rwanda Franc','RWF','646','0'),
('SAINT BARTHÉLEMY','Euro','EUR','978','2'),
('SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA','Saint Helena Pound','SHP','654','2'),
('SAINT KITTS AND NEVIS','East Caribbean Dollar','XCD','951','2'),
('SAINT LUCIA','East Caribbean Dollar','XCD','951','2'),
('SAINT MARTIN (FRENCH PART)','Euro','EUR','978','2'),
('SAINT PIERRE AND MIQUELON','Euro','EUR','978','2'),
('SAINT VINCENT AND THE GRENADINES','East Caribbean Dollar','XCD','951','2'),
('SAMOA','Tala','WST','882','2'),
('SAN MARINO','Euro','EUR','978','2'),
('SAO TOME AND PRINCIPE','Dobra','STD','678','2'),
('SAUDI ARABIA','Saudi Riyal','SAR','682','2'),
('SENEGAL','CFA Franc BCEAO','XOF','952','0'),
('SERBIA','Serbian Dinar','RSD','941','2'),
('SEYCHELLES','Seychelles Rupee','SCR','690','2'),
('SIERRA LEONE','Leone','SLL','694','2'),
('SINGAPORE','Singapore Dollar','SGD','702','2'),
('SINT MAARTEN (DUTCH PART)','Netherlands Antillean Guilder','ANG','532','2'),
('SISTEMA UNITARIO DE COMPENSACION REGIONAL DE PAGOS "SUCRE"','Sucre','XSU','994','N.A.'),
('SLOVAKIA','Euro','EUR','978','2'),
('SLOVENIA','Euro','EUR','978','2'),
('SOLOMON ISLANDS','Solomon Islands Dollar','SBD','090','2'),
('SOMALIA','Somali Shilling','SOS','706','2'),
('SOUTH AFRICA','Rand','ZAR','710','2'),
('SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS','No universal currency','','',''),
('SOUTH SUDAN','South Sudanese Pound','SSP','728','2'),
('SPAIN','Euro','EUR','978','2'),
('SRI LANKA','Sri Lanka Rupee','LKR','144','2'),
('SUDAN (THE)','Sudanese Pound','SDG','938','2'),
('SURINAME','Surinam Dollar','SRD','968','2'),
('SVALBARD AND JAN MAYEN','Norwegian Krone','NOK','578','2'),
('SWAZILAND','Lilangeni','SZL','748','2'),
('SWEDEN','Swedish Krona','SEK','752','2'),
('SWITZERLAND','Swiss Franc','CHF','756','2'),
('SWITZERLAND','WIR Euro','CHE','947','2'),
('SWITZERLAND','WIR Franc','CHW','948','2'),
('SYRIAN ARAB REPUBLIC','Syrian Pound','SYP','760','2'),
('TAIWAN (PROVINCE OF CHINA)','New Taiwan Dollar','TWD','901','2'),
('TAJIKISTAN','Somoni','TJS','972','2'),
('TANZANIA, UNITED REPUBLIC OF','Tanzanian Shilling','TZS','834','2'),
('THAILAND','Baht','THB','764','2'),
('TIMOR-LESTE','US Dollar','USD','840','2'),
('TOGO','CFA Franc BCEAO','XOF','952','0'),
('TOKELAU','New Zealand Dollar','NZD','554','2'),
('TONGA','Pa’anga','TOP','776','2'),
('TRINIDAD AND TOBAGO','Trinidad and Tobago Dollar','TTD','780','2'),
('TUNISIA','Tunisian Dinar','TND','788','3'),
('TURKEY','Turkish Lira','TRY','949','2'),
('TURKMENISTAN','Turkmenistan New Manat','TMT','934','2'),
('TURKS AND CAICOS ISLANDS (THE)','US Dollar','USD','840','2'),
('TUVALU','Australian Dollar','AUD','036','2'),
('UGANDA','Uganda Shilling','UGX','800','0'),
('UKRAINE','Hryvnia','UAH','980','2'),
('UNITED ARAB EMIRATES (THE)','UAE Dirham','AED','784','2'),
('UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND (THE)','Pound Sterling','GBP','826','2'),
('UNITED STATES MINOR OUTLYING ISLANDS (THE)','US Dollar','USD','840','2'),
('UNITED STATES OF AMERICA (THE)','US Dollar','USD','840','2'),
('UNITED STATES OF AMERICA (THE)','US Dollar (Next day)','USN','997','2'),
('URUGUAY','Peso Uruguayo','UYU','858','2'),
('URUGUAY','Uruguay Peso en Unidades Indexadas (URUIURUI)','UYI','940','0'),
('UZBEKISTAN','Uzbekistan Sum','UZS','860','2'),
('VANUATU','Vatu','VUV','548','0'),
('VENEZUELA (BOLIVARIAN REPUBLIC OF)','Bolívar','VEF','937','2'),
('VIET NAM','Dong','VND','704','0'),
('VIRGIN ISLANDS (BRITISH)','US Dollar','USD','840','2'),
('VIRGIN ISLANDS (U.S.)','US Dollar','USD','840','2'),
('WALLIS AND FUTUNA','CFP Franc','XPF','953','0'),
('WESTERN SAHARA','Moroccan Dirham','MAD','504','2'),
('YEMEN','Yemeni Rial','YER','886','2'),
('ZAMBIA','Zambian Kwacha','ZMW','967','2'),
('ZIMBABWE','Zimbabwe Dollar','ZWL','932','2'),
('ZZ01_Bond Markets Unit European_EURCO','Bond Markets Unit European Composite Unit (EURCO)','XBA','955','N.A.'),
('ZZ02_Bond Markets Unit European_EMU-6','Bond Markets Unit European Monetary Unit (E.M.U.-6)','XBB','956','N.A.'),
('ZZ03_Bond Markets Unit European_EUA-9','Bond Markets Unit European Unit of Account 9 (E.U.A.-9)','XBC','957','N.A.'),
('ZZ04_Bond Markets Unit European_EUA-17','Bond Markets Unit European Unit of Account 17 (E.U.A.-17)','XBD','958','N.A.'),
('ZZ06_Testing_Code','Codes specifically reserved for testing purposes','XTS','963','N.A.'),
('ZZ07_No_Currency','The codes assigned for transactions where no currency is involved','XXX','999','N.A.'),
('ZZ08_Gold','Gold','XAU','959','N.A.'),
('ZZ09_Palladium','Palladium','XPD','964','N.A.'),
('ZZ10_Platinum','Platinum','XPT','962','N.A.'),
('ZZ11_Silver','Silver','XAG','961','N.A.');

drop table if exists language cascade;
create table Language(
    id serial primary key,
    alpha2 varchar(2),
    name text
);

insert into Language ("alpha2", "name") values
('aa','Afar'),
('ab','Abkhazian'),
('ae','Avestan'),
('af','Afrikaans'),
('ak','Akan'),
('am','Amharic'),
('an','Aragonese'),
('ar','Arabic'),
('as','Assamese'),
('av','Avaric'),
('ay','Aymara'),
('az','Azerbaijani'),
('ba','Bashkir'),
('be','Belarusian'),
('bg','Bulgarian'),
('bh','Bihari languages'),
('bi','Bislama'),
('bm','Bambara'),
('bn','Bengali'),
('bo','Tibetan'),
('br','Breton'),
('bs','Bosnian'),
('ca','Catalan; Valencian'),
('ce','Chechen'),
('ch','Chamorro'),
('co','Corsican'),
('cr','Cree'),
('cs','Czech'),
('cu','Church Slavic; Old Slavonic; Church Slavonic; Old Bulgarian; Old Church Slavonic'),
('cv','Chuvash'),
('cy','Welsh'),
('da','Danish'),
('de','German'),
('dv','Divehi; Dhivehi; Maldivian'),
('dz','Dzongkha'),
('ee','Ewe'),
('el','Greek, Modern (1453-)'),
('en','English'),
('eo','Esperanto'),
('es','Spanish; Castilian'),
('et','Estonian'),
('eu','Basque'),
('fa','Persian'),
('ff','Fulah'),
('fi','Finnish'),
('fj','Fijian'),
('fo','Faroese'),
('fr','French'),
('fy','Western Frisian'),
('ga','Irish'),
('gd','Gaelic; Scottish Gaelic'),
('gl','Galician'),
('gn','Guarani'),
('gu','Gujarati'),
('gv','Manx'),
('ha','Hausa'),
('he','Hebrew'),
('hi','Hindi'),
('ho','Hiri Motu'),
('hr','Croatian'),
('ht','Haitian; Haitian Creole'),
('hu','Hungarian'),
('hy','Armenian'),
('hz','Herero'),
('ia','Interlingua (International Auxiliary Language Association)'),
('id','Indonesian'),
('ie','Interlingue; Occidental'),
('ig','Igbo'),
('ii','Sichuan Yi; Nuosu'),
('ik','Inupiaq'),
('io','Ido'),
('is','Icelandic'),
('it','Italian'),
('iu','Inuktitut'),
('ja','Japanese'),
('jv','Javanese'),
('ka','Georgian'),
('kg','Kongo'),
('ki','Kikuyu; Gikuyu'),
('kj','Kuanyama; Kwanyama'),
('kk','Kazakh'),
('kl','Kalaallisut; Greenlandic'),
('km','Central Khmer'),
('kn','Kannada'),
('ko','Korean'),
('kr','Kanuri'),
('ks','Kashmiri'),
('ku','Kurdish'),
('kv','Komi'),
('kw','Cornish'),
('ky','Kirghiz; Kyrgyz'),
('la','Latin'),
('lb','Luxembourgish; Letzeburgesch'),
('lg','Ganda'),
('li','Limburgan; Limburger; Limburgish'),
('ln','Lingala'),
('lo','Lao'),
('lt','Lithuanian'),
('lu','Luba-Katanga'),
('lv','Latvian'),
('mg','Malagasy'),
('mh','Marshallese'),
('mi','Maori'),
('mk','Macedonian'),
('ml','Malayalam'),
('mn','Mongolian'),
('mr','Marathi'),
('ms','Malay'),
('mt','Maltese'),
('my','Burmese'),
('na','Nauru'),
('nb','Bokmål, Norwegian; Norwegian Bokmål'),
('nd','Ndebele, North; North Ndebele'),
('ne','Nepali'),
('ng','Ndonga'),
('nl','Dutch; Flemish'),
('nn','Norwegian Nynorsk; Nynorsk, Norwegian'),
('no','Norwegian'),
('nr','Ndebele, South; South Ndebele'),
('nv','Navajo; Navaho'),
('ny','Chichewa; Chewa; Nyanja'),
('oc','Occitan (post 1500); Provençal'),
('oj','Ojibwa'),
('om','Oromo'),
('or','Oriya'),
('os','Ossetian; Ossetic'),
('pa','Panjabi; Punjabi'),
('pi','Pali'),
('pl','Polish'),
('ps','Pushto; Pashto'),
('pt','Portuguese'),
('qu','Quechua'),
('rm','Romansh'),
('rn','Rundi'),
('ro','Romanian; Moldavian; Moldovan'),
('ru','Russian'),
('rw','Kinyarwanda'),
('sa','Sanskrit'),
('sc','Sardinian'),
('sd','Sindhi'),
('se','Northern Sami'),
('sg','Sango'),
('si','Sinhala; Sinhalese'),
('sk','Slovak'),
('sl','Slovenian'),
('sm','Samoan'),
('sn','Shona'),
('so','Somali'),
('sq','Albanian'),
('sr','Serbian'),
('ss','Swati'),
('st','Sotho, Southern'),
('su','Sundanese'),
('sv','Swedish'),
('sw','Swahili'),
('ta','Tamil'),
('te','Telugu'),
('tg','Tajik'),
('th','Thai'),
('ti','Tigrinya'),
('tk','Turkmen'),
('tl','Tagalog'),
('tn','Tswana'),
('to','Tonga (Tonga Islands)'),
('tr','Turkish'),
('ts','Tsonga'),
('tt','Tatar'),
('tw','Twi'),
('ty','Tahitian'),
('ug','Uighur; Uyghur'),
('uk','Ukrainian'),
('ur','Urdu'),
('uz','Uzbek'),
('ve','Venda'),
('vi','Vietnamese'),
('vo','Volapük'),
('wa','Walloon'),
('wo','Wolof'),
('xh','Xhosa'),
('yi','Yiddish'),
('yo','Yoruba'),
('za','Zhuang; Chuang'),
('zh','Chinese'),
('zu','Zulu');

drop table if exists DocumentFormat;
create table DocumentFormat(
    id serial primary key,
    name text,
    template text
);
/*
insert into DocumentFormat ("name","template") values
('','');
*/