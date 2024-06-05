insert into user (username, firstname, lastname, password, mobile, roleId) values ('Admin1', 'Admin', '1', 'Passord01', '12345678', 1); 

insert into role (name) values ('Administrasjon'), ('Salg'), ('Montering'), ('Kunde'); 
insert into role (name) values ('Inactive'); 

INSERT INTO solcelle (name, description, model, built, output, typeId) VALUES ('Solcelle 1', 'Solcelle 1 beskrivelse', 'Model 1', '2020', 100, 1);
INSERT INTO solcelle (name, description, model, built, output, typeId) VALUES ('Solcelle 2', 'Solcelle 2 beskrivelse', 'Model 2', '2020', 300, 3);

INSERT INTO solcelle_user (userId, solcelleId, date) VALUES (4, 1, '2020-01-01 00:00:00');
INSERT INTO solcelle_user (userId, solcelleId, date) VALUES (4, 2, '2023-01-01 00:00:00');
INSERT INTO solcelle_user (userId, solcelleId, date) VALUES (1, 1, '2023-01-01 00:00:00');
INSERT INTO solcelle_user (userId, solcelleId, date) VALUES (5, 2, '2023-01-01 00:00:00');


INSERT INTO type (name, description, imgURL) VALUES ('Skråtak', 'Det tilbys løsninger for de aller fleste taktyper. Festesystemene som brukes innebærer en krokanordning som skrues fast i lektene og videre ned i takstolen under taket. I disse krokene monteres et skinnesystem som solcellepanelene blir festet i med klemmer. Taket skal alltid være tett etter solcellemontasje.', './img/skraatak.png');
INSERT INTO type (name, description, imgURL) VALUES ('Flate tak', 'Montasjesystemet plasseres løst på taket og for å holde systemet nede ved kraftig vind blir det lagt på ballaststein under solcellepanelene. Mengden stein vil variere stort basert på geografisk plassering, hvor nærme kanten solcellepanelene blir plassert og høyde på parapet. Det er viktig at du sjekker hva taket ditt er dimensjonert for, da det kan bli mye vekt på taket.', './img/flatetak.png');
INSERT INTO type (name, description, imgURL) VALUES ('Bygningsintegrert', 'Det tilbys også bygningsintegrerte solcellepaneler på skråtak. Dette gjør at panelene ofte ligger i flukt med omkringliggende takstein. Dette kan ha estetisk verdi, i tillegg til at man sparer kostnad for takstein i det aktuelle området. Dersom du uansett rehabiliterer taket er bygningsintegrerte solceller et godt alternativ.', './img/bygningsintegrert.png');



