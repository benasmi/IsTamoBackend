DROP DATABASE IF EXISTS tamo;
CREATE DATABASE IF NOT EXISTS tamo;
USE tamo;

CREATE TABLE GLOBAL_SETTINGS(
	id int AUTO_INCREMENT PRIMARY KEY,
	version varchar(255) NOT NULL,
	theme ENUM('light', 'dark'),
    alter_date datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	school_name varchar(255),
	school_address varchar(255),
	school_number varchar(255)
);


CREATE TABLE ROLE(
	id int AUTO_INCREMENT PRIMARY KEY,
	name varchar(255) NOT NULL
);


CREATE TABLE USERS(
	id int AUTO_INCREMENT PRIMARY KEY,
	fk_roleId int NOT NULL,
    fk_userId int,
	name varchar(255) NOT NULL,
	surname varchar(255) NOT NULL,
	birthday datetime NOT NULL,
	email varchar(255) NOT NULL,
	password varchar(255) NOT NULL,
	refresh_token varchar(255),
	insertion_date datetime DEFAULT CURRENT_TIMESTAMP,
	alter_date datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	version varchar(20),
	address varchar(255) NOT NULL,
	id_code varchar(255) NOT NULL,
	CONSTRAINT FK_role_users FOREIGN KEY (fk_roleId) REFERENCES ROLE(id),
    CONSTRAINT FK_user_users FOREIGN KEY (fk_userId) REFERENCES USERS(id),
	CONSTRAINT UC_Users UNIQUE (id_code, name, surname)
);

CREATE TABLE PHONE_NUMBER(
	id int AUTO_INCREMENT PRIMARY KEY,
	fk_userId int NOT NULL,
	phone_number varchar(255) NOT NULL,
	CONSTRAINT FK_Users_phone_number FOREIGN KEY (fk_userId) REFERENCES USERS(id)
);


CREATE TABLE NEWS(
	id int AUTO_INCREMENT PRIMARY KEY,
	fk_userId int NOT NULL,
	title varchar(255) NOT NULL,
	content text NOT NULL,
	insertion_date datetime DEFAULT CURRENT_TIMESTAMP,
	alter_date datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT FK_Users_news FOREIGN KEY (fk_userId) REFERENCES USERS(id)
);


CREATE TABLE REPORTS(
	id int AUTO_INCREMENT PRIMARY KEY,
	fk_newsId int NOT NULL,
	fk_userId int NOT NULL,
	insertion_date datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT FK_News_report FOREIGN KEY (fk_newsId) REFERENCES NEWS(id),
	CONSTRAINT FK_Users_report FOREIGN KEY (fk_userId) REFERENCES USERS(id)
);


CREATE TABLE UP_VOTES(
	id int AUTO_INCREMENT PRIMARY KEY,
	fk_newsId int NOT NULL,
	fk_userId int NOT NULL,
	insertion_date datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT FK_News_upvotes FOREIGN KEY (fk_newsId) REFERENCES NEWS(id),
	CONSTRAINT FK_Users_upvotes FOREIGN KEY (fk_userId) REFERENCES USERS(id)
);


CREATE TABLE SUBJECT(
	id int AUTO_INCREMENT PRIMARY KEY,
	name varchar(255) NOT NULL,
	description varchar(255) NOT NULL,
	hours int NOT NULL,
	insertion_date datetime DEFAULT CURRENT_TIMESTAMP,
	alter_date datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE SUBJECT_USER(
	id int AUTO_INCREMENT PRIMARY KEY,
	fk_subjectId int NOT NULL,
	fk_userId int NOT NULL,
	insertion_date datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT FK_subject_user_subject FOREIGN KEY (fk_userId) REFERENCES USERS(id),
	CONSTRAINT FK_subject_user_user FOREIGN KEY (fk_subjectId) REFERENCES SUBJECT(id)
);

CREATE TABLE MARK(
	id int AUTO_INCREMENT PRIMARY KEY,
	mark int NOT NULL,
	fk_subjectId int NOT NULL,
	fk_userId int NOT NULL,
	insertion_date datetime DEFAULT CURRENT_TIMESTAMP,
	alter_date datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	mark_type ENUM('Kontrolinis', 'Savarankiskas', 'Lankomumas'),
	description varchar(255) NOT NULL,
	CONSTRAINT FK_mark_user_subject FOREIGN KEY (fk_userId) REFERENCES USERS(id),
	CONSTRAINT FK_mark_user_user FOREIGN KEY (fk_subjectId) REFERENCES SUBJECT(id)
);

CREATE TABLE SCHEDULE(
	id int AUTO_INCREMENT PRIMARY KEY,
	name varchar(255) NOT NULL,
	description varchar(255) NOT NULL,
	insertion_date datetime DEFAULT CURRENT_TIMESTAMP,
	alter_date datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE ROOM(
	id int AUTO_INCREMENT PRIMARY KEY,
	name varchar(255) NOT NULL,
	description varchar(255) NOT NULL,
	max_count int NOT NULL,
	computers_count int NOT NULL,
	insertion_date datetime DEFAULT CURRENT_TIMESTAMP,
	alter_date datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE SUBJECT_SCHEDULE(
	id int AUTO_INCREMENT PRIMARY KEY,
	week_day int NOT NULL,
	subject_time time, 
	fk_subjectId int NOT NULL,
	fk_roomId int NOT NULL,
	fk_scheduleId int NOT NULL,
	CONSTRAINT FK_SUBJECT_SCHEDULE_subject FOREIGN KEY (fk_subjectId) REFERENCES SUBJECT(id),
	CONSTRAINT FK_SUBJECT_SCHEDULE_schedule FOREIGN KEY (fk_scheduleId) REFERENCES SCHEDULE(id),
	CONSTRAINT FK_SUBJECT_SCHEDULE_room FOREIGN KEY (fk_roomId) REFERENCES ROOM(id)
);

CREATE TABLE ATTENDENCE(
	id int AUTO_INCREMENT PRIMARY KEY,
	status int DEFAULT 0,
	fk_userId int NOT NULL,
	fk_subject_schedule_Id int NOT NULL,
	insertion_date datetime default CURRENT_TIMESTAMP,
	alter_date datetime default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	justified boolean,
	description varchar(255) NOT NULL,
	CONSTRAINT FK_ATTENDENCE_subject_schedule FOREIGN KEY (fk_userId) REFERENCES USERS(id),
	CONSTRAINT FK_ATTENDENCE_user FOREIGN KEY (fk_subject_schedule_Id) REFERENCES SUBJECT_SCHEDULE(id)
);

CREATE TABLE SUBJECT_TEST(
	id int AUTO_INCREMENT PRIMARY KEY,
	fk_roomId int NOT NULL,
	fk_subject_schedule_Id int NOT NULL,
	insertion_date datetime default CURRENT_TIMESTAMP,
	alter_date datetime default CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	test_type ENUM('Kontrolinis', 'Savarankiskas'),
	CONSTRAINT FK_SUBJECT_TEST_subject_schedule FOREIGN KEY (fk_roomId) REFERENCES ROOM(id),
	CONSTRAINT FK_SUBJECT_TEST_room FOREIGN KEY (fk_subject_schedule_Id) REFERENCES SUBJECT_SCHEDULE(id)
);
