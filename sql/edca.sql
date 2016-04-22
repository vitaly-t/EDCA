
/* CONTRATING PROCESS */
create table ContractingProcess                                                                                                                                                                                                       (id serial primary key, fecha_creacion date, hora_creacion time);


/* PLANNING */
create table Planning (id serial primary key, ContractingProcess_id int references ContractingProcess(id));

create table budget (id serial primary key, contractingprocess_id int references contractingprocess(id), planning_id int references planning(id), budget_source text, budget_description text, budget_amount decimal, budget_currency text, budget_project text, budget_projectID text, budget_uri text, rationale text );

create table PlanningDocument (id serial primary key, contractingprocess_id int references contractingprocess(id), planning_id int references planning(id), document_type text, title text, description text, url text, date_published timestamp, date_modified timestamp, format text, language text );

create table BudgetDocument (id serial primary key, contractingprocess_id int references contractingprocess(id), budget_id int references budget(id), document_type text, title text, description text, url text, date_published timestamp, date_modified timestamp, format text, language text );


/* BUYER */

create table buyer (id serial primary key, contractingprocess_id int references ContractingProcess(id), )
