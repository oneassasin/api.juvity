-- Database generated with pgModeler (PostgreSQL Database Modeler).
-- pgModeler  version: 0.8.1-beta
-- PostgreSQL version: 9.4
-- Project Site: pgmodeler.com.br
-- Model Author: ---


-- Database creation must be done outside an multicommand file.
-- These commands were put in this file only for convenience.
-- -- object: juvity | type: DATABASE --
-- -- DROP DATABASE IF EXISTS juvity;
-- CREATE DATABASE juvity
-- 	ENCODING = 'UTF8'
-- ;
-- -- ddl-end --
-- 

-- object: juvity | type: SCHEMA --
-- DROP SCHEMA IF EXISTS juvity CASCADE;
CREATE SCHEMA juvity;
-- ddl-end --
ALTER SCHEMA juvity OWNER TO postgres;
-- ddl-end --

SET search_path TO pg_catalog,public,juvity;
-- ddl-end --

-- object: juvity.users | type: TABLE --
-- DROP TABLE IF EXISTS juvity.users CASCADE;
CREATE TABLE juvity.users(
	id bigserial NOT NULL,
	role_id bigint NOT NULL,
	email text NOT NULL,
	hash_password text NOT NULL,
	name text NOT NULL,
	surname text NOT NULL,
	patronymic text NOT NULL,
	gender bit,
	registration_time bigint NOT NULL DEFAULT extract(epoch from now()),
	CONSTRAINT "userIdPK" PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE juvity.users OWNER TO postgres;
-- ddl-end --

-- object: juvity.teachers | type: TABLE --
-- DROP TABLE IF EXISTS juvity.teachers CASCADE;
CREATE TABLE juvity.teachers(
	id bigserial NOT NULL,
	department_id bigint NOT NULL,
	rank_id bigint NOT NULL,
	name text NOT NULL,
	surname text NOT NULL,
	patronymic text NOT NULL,
	json text,
	CONSTRAINT "teachersIdPK" PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE juvity.teachers OWNER TO postgres;
-- ddl-end --

-- object: juvity.lessons | type: TABLE --
-- DROP TABLE IF EXISTS juvity.lessons CASCADE;
CREATE TABLE juvity.lessons(
	id bigserial NOT NULL,
	teacher_id bigint NOT NULL,
	lesson_name_id bigint NOT NULL,
	lesson_schedule_id bigint NOT NULL,
	lesson_type_id bigint NOT NULL,
	semester_id bigint NOT NULL,
	CONSTRAINT lessons_id_pm PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE juvity.lessons OWNER TO postgres;
-- ddl-end --

-- object: juvity.lesson_schedule_day_enum | type: TYPE --
-- DROP TYPE IF EXISTS juvity.lesson_schedule_day_enum CASCADE;
CREATE TYPE juvity.lesson_schedule_day_enum AS
 ENUM ('0','1','2','3','4','5','6');
-- ddl-end --
ALTER TYPE juvity.lesson_schedule_day_enum OWNER TO postgres;
-- ddl-end --

-- object: juvity.lesson_schedules | type: TABLE --
-- DROP TABLE IF EXISTS juvity.lesson_schedules CASCADE;
CREATE TABLE juvity.lesson_schedules(
	id bigserial NOT NULL,
	number_weak smallint NOT NULL,
	day juvity.lesson_schedule_day_enum NOT NULL,
	lesson_start_time bigint NOT NULL,
	lesson_end_time bigint NOT NULL,
	CONSTRAINT lesson_schedules_pm PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE juvity.lesson_schedules OWNER TO postgres;
-- ddl-end --

-- object: juvity.lesson_names | type: TABLE --
-- DROP TABLE IF EXISTS juvity.lesson_names CASCADE;
CREATE TABLE juvity.lesson_names(
	id bigserial NOT NULL,
	name text NOT NULL,
	name_abbr text,
	CONSTRAINT lesson_names_id_pk PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE juvity.lesson_names OWNER TO postgres;
-- ddl-end --

-- object: juvity.lesson_types | type: TABLE --
-- DROP TABLE IF EXISTS juvity.lesson_types CASCADE;
CREATE TABLE juvity.lesson_types(
	id bigserial NOT NULL,
	name text NOT NULL,
	CONSTRAINT lesson_type_id_pm PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE juvity.lesson_types OWNER TO postgres;
-- ddl-end --

-- object: juvity.semesters | type: TABLE --
-- DROP TABLE IF EXISTS juvity.semesters CASCADE;
CREATE TABLE juvity.semesters(
	id bigserial NOT NULL,
	semester_start bigint NOT NULL,
	semester_end bigint NOT NULL,
	CONSTRAINT semester_id_pk PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE juvity.semesters OWNER TO postgres;
-- ddl-end --

-- object: juvity.groups | type: TABLE --
-- DROP TABLE IF EXISTS juvity.groups CASCADE;
CREATE TABLE juvity.groups(
	id bigserial NOT NULL,
	name text NOT NULL,
	name_abbr text,
	stream_number integer NOT NULL,
	department_id bigint NOT NULL,
	acquisition_year bigint NOT NULL,
	CONSTRAINT group_id_pm PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE juvity.groups OWNER TO postgres;
-- ddl-end --

-- object: juvity.students | type: TABLE --
-- DROP TABLE IF EXISTS juvity.students CASCADE;
CREATE TABLE juvity.students(
	id bigserial NOT NULL,
	name text NOT NULL,
	patronymic text NOT NULL,
	surname text NOT NULL,
	born_day bigint NOT NULL,
	CONSTRAINT "groupStudentIdPK" PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE juvity.students OWNER TO postgres;
-- ddl-end --

-- object: juvity.departments | type: TABLE --
-- DROP TABLE IF EXISTS juvity.departments CASCADE;
CREATE TABLE juvity.departments(
	id bigserial NOT NULL,
	name text NOT NULL,
	name_abbr text,
	faculty_id bigint NOT NULL,
	CONSTRAINT "departmentIdPK" PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE juvity.departments OWNER TO postgres;
-- ddl-end --

-- object: juvity.universities | type: TABLE --
-- DROP TABLE IF EXISTS juvity.universities CASCADE;
CREATE TABLE juvity.universities(
	id bigserial NOT NULL,
	name text NOT NULL,
	name_abbr text,
	country text NOT NULL,
	city text NOT NULL,
	CONSTRAINT "universityIdPK" PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE juvity.universities OWNER TO postgres;
-- ddl-end --

-- object: juvity.group_lessons | type: TABLE --
-- DROP TABLE IF EXISTS juvity.group_lessons CASCADE;
CREATE TABLE juvity.group_lessons(
	group_id bigint NOT NULL,
	lesson_id bigint NOT NULL
);
-- ddl-end --
ALTER TABLE juvity.group_lessons OWNER TO postgres;
-- ddl-end --

-- object: "usersIdIndex" | type: INDEX --
-- DROP INDEX IF EXISTS juvity."usersIdIndex" CASCADE;
CREATE UNIQUE INDEX "usersIdIndex" ON juvity.users
	USING btree
	(
	  id ASC NULLS LAST
	);
-- ddl-end --

-- object: "groupIdIndex" | type: INDEX --
-- DROP INDEX IF EXISTS juvity."groupIdIndex" CASCADE;
CREATE UNIQUE INDEX "groupIdIndex" ON juvity.groups
	USING btree
	(
	  id ASC NULLS LAST
	);
-- ddl-end --

-- object: "groupLessonsGroupId" | type: INDEX --
-- DROP INDEX IF EXISTS juvity."groupLessonsGroupId" CASCADE;
CREATE INDEX "groupLessonsGroupId" ON juvity.group_lessons
	USING btree
	(
	  group_id ASC NULLS LAST
	);
-- ddl-end --

-- object: "techersIdIndex" | type: INDEX --
-- DROP INDEX IF EXISTS juvity."techersIdIndex" CASCADE;
CREATE UNIQUE INDEX "techersIdIndex" ON juvity.teachers
	USING btree
	(
	  id ASC NULLS LAST
	);
-- ddl-end --

-- object: juvity.user_roles | type: TABLE --
-- DROP TABLE IF EXISTS juvity.user_roles CASCADE;
CREATE TABLE juvity.user_roles(
	id bigserial NOT NULL,
	name text NOT NULL,
	bit_mask bit(11) NOT NULL DEFAULT '00000000000',
	CONSTRAINT "userRolesPK" PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE juvity.user_roles OWNER TO postgres;
-- ddl-end --

-- object: juvity.institutions | type: TABLE --
-- DROP TABLE IF EXISTS juvity.institutions CASCADE;
CREATE TABLE juvity.institutions(
	id bigserial NOT NULL,
	coordinate point NOT NULL,
	name text NOT NULL,
	name_abbr text,
	university_id bigint,
	CONSTRAINT "institutePK" PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE juvity.institutions OWNER TO postgres;
-- ddl-end --

-- object: juvity.teacher_ranks | type: TABLE --
-- DROP TABLE IF EXISTS juvity.teacher_ranks CASCADE;
CREATE TABLE juvity.teacher_ranks(
	id bigserial NOT NULL,
	name text NOT NULL,
	CONSTRAINT "teacherRanksIDPK" PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE juvity.teacher_ranks OWNER TO postgres;
-- ddl-end --

-- object: juvity.sessions | type: TABLE --
-- DROP TABLE IF EXISTS juvity.sessions CASCADE;
CREATE TABLE juvity.sessions(
	session text NOT NULL,
	json text NOT NULL DEFAULT '{}',
	user_id bigint NOT NULL,
	expired bigint NOT NULL
);
-- ddl-end --
ALTER TABLE juvity.sessions OWNER TO postgres;
-- ddl-end --

-- object: sessions_session_index | type: INDEX --
-- DROP INDEX IF EXISTS juvity.sessions_session_index CASCADE;
CREATE UNIQUE INDEX sessions_session_index ON juvity.sessions
	USING btree
	(
	  session ASC NULLS LAST
	);
-- ddl-end --

-- object: juvity.user_workers | type: TABLE --
-- DROP TABLE IF EXISTS juvity.user_workers CASCADE;
CREATE TABLE juvity.user_workers(
	id bigserial NOT NULL,
	user_id bigint NOT NULL,
	university_id bigint,
	instutute_id bigint NOT NULL,
	faculty_id bigint NOT NULL,
	CONSTRAINT "userWorkerPK" PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE juvity.user_workers OWNER TO postgres;
-- ddl-end --

-- object: "userWorkerIDIndex" | type: INDEX --
-- DROP INDEX IF EXISTS juvity."userWorkerIDIndex" CASCADE;
CREATE UNIQUE INDEX "userWorkerIDIndex" ON juvity.user_workers
	USING btree
	(
	  id ASC NULLS LAST
	);
-- ddl-end --

-- object: juvity.faculties | type: TABLE --
-- DROP TABLE IF EXISTS juvity.faculties CASCADE;
CREATE TABLE juvity.faculties(
	id bigserial NOT NULL,
	institute_id bigint NOT NULL,
	name text NOT NULL,
	name_abbr text,
	CONSTRAINT "facultiesIdPK" PRIMARY KEY (id)

);
-- ddl-end --
ALTER TABLE juvity.faculties OWNER TO postgres;
-- ddl-end --

-- object: users_unique_index | type: INDEX --
-- DROP INDEX IF EXISTS juvity.users_unique_index CASCADE;
CREATE UNIQUE INDEX users_unique_index ON juvity.users
	USING btree
	(
	  email ASC NULLS LAST
	);
-- ddl-end --

-- object: universities_name_unique_index | type: INDEX --
-- DROP INDEX IF EXISTS juvity.universities_name_unique_index CASCADE;
CREATE UNIQUE INDEX universities_name_unique_index ON juvity.universities
	USING btree
	(
	  name ASC NULLS LAST
	);
-- ddl-end --

-- object: faculties_unique_index | type: INDEX --
-- DROP INDEX IF EXISTS juvity.faculties_unique_index CASCADE;
CREATE UNIQUE INDEX faculties_unique_index ON juvity.faculties
	USING btree
	(
	  name ASC NULLS LAST,
	  institute_id ASC NULLS LAST
	);
-- ddl-end --

-- object: instutitions_unique_index | type: INDEX --
-- DROP INDEX IF EXISTS juvity.instutitions_unique_index CASCADE;
CREATE UNIQUE INDEX instutitions_unique_index ON juvity.institutions
	USING btree
	(
	  name ASC NULLS LAST,
	  university_id ASC NULLS LAST
	);
-- ddl-end --

-- object: departments_unique_index | type: INDEX --
-- DROP INDEX IF EXISTS juvity.departments_unique_index CASCADE;
CREATE UNIQUE INDEX departments_unique_index ON juvity.departments
	USING btree
	(
	  name ASC NULLS LAST,
	  faculty_id ASC NULLS LAST
	);
-- ddl-end --

-- object: groups_name_unique_index | type: INDEX --
-- DROP INDEX IF EXISTS juvity.groups_name_unique_index CASCADE;
CREATE UNIQUE INDEX groups_name_unique_index ON juvity.groups
	USING btree
	(
	  name ASC NULLS LAST,
	  stream_number ASC NULLS LAST,
	  department_id ASC NULLS LAST,
	  acquisition_year ASC NULLS LAST
	);
-- ddl-end --

-- object: teacher_ranks_unique_index | type: INDEX --
-- DROP INDEX IF EXISTS juvity.teacher_ranks_unique_index CASCADE;
CREATE UNIQUE INDEX teacher_ranks_unique_index ON juvity.teacher_ranks
	USING btree
	(
	  name ASC NULLS LAST
	);
-- ddl-end --

-- object: teachers_unique_index | type: INDEX --
-- DROP INDEX IF EXISTS juvity.teachers_unique_index CASCADE;
CREATE UNIQUE INDEX teachers_unique_index ON juvity.teachers
	USING btree
	(
	  department_id ASC NULLS LAST,
	  rank_id ASC NULLS LAST,
	  name ASC NULLS LAST,
	  surname ASC NULLS LAST,
	  patronymic ASC NULLS LAST
	);
-- ddl-end --

-- object: sessions_user_id_index | type: INDEX --
-- DROP INDEX IF EXISTS juvity.sessions_user_id_index CASCADE;
CREATE UNIQUE INDEX sessions_user_id_index ON juvity.sessions
	USING btree
	(
	  user_id ASC NULLS LAST
	);
-- ddl-end --

-- object: students_unique_index | type: INDEX --
-- DROP INDEX IF EXISTS juvity.students_unique_index CASCADE;
CREATE UNIQUE INDEX students_unique_index ON juvity.students
	USING btree
	(
	  name ASC NULLS LAST,
	  patronymic ASC NULLS LAST,
	  surname ASC NULLS LAST,
	  born_day ASC NULLS LAST
	);
-- ddl-end --

-- object: lesson_type_unique_index | type: INDEX --
-- DROP INDEX IF EXISTS juvity.lesson_type_unique_index CASCADE;
CREATE UNIQUE INDEX lesson_type_unique_index ON juvity.lesson_types
	USING btree
	(
	  name ASC NULLS LAST
	);
-- ddl-end --

-- object: lesson_name_unique_index | type: INDEX --
-- DROP INDEX IF EXISTS juvity.lesson_name_unique_index CASCADE;
CREATE UNIQUE INDEX lesson_name_unique_index ON juvity.lesson_names
	USING btree
	(
	  name ASC NULLS LAST
	);
-- ddl-end --

-- object: lesson_schedule_unique_index | type: INDEX --
-- DROP INDEX IF EXISTS juvity.lesson_schedule_unique_index CASCADE;
CREATE UNIQUE INDEX lesson_schedule_unique_index ON juvity.lesson_schedules
	USING btree
	(
	  number_weak ASC NULLS LAST,
	  day ASC NULLS LAST,
	  lesson_start_time ASC NULLS LAST,
	  lesson_end_time ASC NULLS LAST
	);
-- ddl-end --

-- object: semesters_unique_index | type: INDEX --
-- DROP INDEX IF EXISTS juvity.semesters_unique_index CASCADE;
CREATE UNIQUE INDEX semesters_unique_index ON juvity.semesters
	USING btree
	(
	  semester_start ASC NULLS LAST,
	  semester_end ASC NULLS LAST
	);
-- ddl-end --

-- object: user_roles_unique_index | type: INDEX --
-- DROP INDEX IF EXISTS juvity.user_roles_unique_index CASCADE;
CREATE UNIQUE INDEX user_roles_unique_index ON juvity.user_roles
	USING btree
	(
	  name ASC NULLS LAST
	);
-- ddl-end --

-- object: juvity.group_students | type: TABLE --
-- DROP TABLE IF EXISTS juvity.group_students CASCADE;
CREATE TABLE juvity.group_students(
	student_id bigint NOT NULL,
	group_id bigint NOT NULL
);
-- ddl-end --
ALTER TABLE juvity.group_students OWNER TO postgres;
-- ddl-end --

-- object: group_students_unique_index | type: INDEX --
-- DROP INDEX IF EXISTS juvity.group_students_unique_index CASCADE;
CREATE UNIQUE INDEX group_students_unique_index ON juvity.group_students
	USING btree
	(
	  student_id ASC NULLS LAST,
	  group_id ASC NULLS LAST
	);
-- ddl-end --

-- object: lessons_unique_index | type: INDEX --
-- DROP INDEX IF EXISTS juvity.lessons_unique_index CASCADE;
CREATE UNIQUE INDEX lessons_unique_index ON juvity.lessons
	USING btree
	(
	  teacher_id ASC NULLS LAST,
	  lesson_name_id ASC NULLS LAST,
	  lesson_schedule_id ASC NULLS LAST,
	  lesson_type_id ASC NULLS LAST,
	  semester_id ASC NULLS LAST
	);
-- ddl-end --

-- object: group_lesson_unique_index | type: INDEX --
-- DROP INDEX IF EXISTS juvity.group_lesson_unique_index CASCADE;
CREATE UNIQUE INDEX group_lesson_unique_index ON juvity.group_lessons
	USING btree
	(
	  group_id ASC NULLS LAST,
	  lesson_id ASC NULLS LAST
	);
-- ddl-end --

-- object: group_students_group_index | type: INDEX --
-- DROP INDEX IF EXISTS juvity.group_students_group_index CASCADE;
CREATE INDEX group_students_group_index ON juvity.group_students
	USING btree
	(
	  group_id ASC NULLS LAST
	);
-- ddl-end --

-- object: "UserIdRole" | type: CONSTRAINT --
-- ALTER TABLE juvity.users DROP CONSTRAINT IF EXISTS "UserIdRole" CASCADE;
ALTER TABLE juvity.users ADD CONSTRAINT "UserIdRole" FOREIGN KEY (role_id)
REFERENCES juvity.user_roles (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: "teachersDepartmentIdFK" | type: CONSTRAINT --
-- ALTER TABLE juvity.teachers DROP CONSTRAINT IF EXISTS "teachersDepartmentIdFK" CASCADE;
ALTER TABLE juvity.teachers ADD CONSTRAINT "teachersDepartmentIdFK" FOREIGN KEY (department_id)
REFERENCES juvity.departments (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: "teachersRankIdFK" | type: CONSTRAINT --
-- ALTER TABLE juvity.teachers DROP CONSTRAINT IF EXISTS "teachersRankIdFK" CASCADE;
ALTER TABLE juvity.teachers ADD CONSTRAINT "teachersRankIdFK" FOREIGN KEY (rank_id)
REFERENCES juvity.teacher_ranks (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: lessons_teacher_id_fk | type: CONSTRAINT --
-- ALTER TABLE juvity.lessons DROP CONSTRAINT IF EXISTS lessons_teacher_id_fk CASCADE;
ALTER TABLE juvity.lessons ADD CONSTRAINT lessons_teacher_id_fk FOREIGN KEY (teacher_id)
REFERENCES juvity.teachers (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: lessons_lesson_schedule_id_fk | type: CONSTRAINT --
-- ALTER TABLE juvity.lessons DROP CONSTRAINT IF EXISTS lessons_lesson_schedule_id_fk CASCADE;
ALTER TABLE juvity.lessons ADD CONSTRAINT lessons_lesson_schedule_id_fk FOREIGN KEY (lesson_schedule_id)
REFERENCES juvity.lesson_schedules (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: lessons_lesson_name_id_fk | type: CONSTRAINT --
-- ALTER TABLE juvity.lessons DROP CONSTRAINT IF EXISTS lessons_lesson_name_id_fk CASCADE;
ALTER TABLE juvity.lessons ADD CONSTRAINT lessons_lesson_name_id_fk FOREIGN KEY (lesson_name_id)
REFERENCES juvity.lesson_names (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: lessons_lesson_type_id_fk | type: CONSTRAINT --
-- ALTER TABLE juvity.lessons DROP CONSTRAINT IF EXISTS lessons_lesson_type_id_fk CASCADE;
ALTER TABLE juvity.lessons ADD CONSTRAINT lessons_lesson_type_id_fk FOREIGN KEY (lesson_type_id)
REFERENCES juvity.lesson_types (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: lessons_semester_id_fk | type: CONSTRAINT --
-- ALTER TABLE juvity.lessons DROP CONSTRAINT IF EXISTS lessons_semester_id_fk CASCADE;
ALTER TABLE juvity.lessons ADD CONSTRAINT lessons_semester_id_fk FOREIGN KEY (semester_id)
REFERENCES juvity.semesters (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: groups_department_id_fk | type: CONSTRAINT --
-- ALTER TABLE juvity.groups DROP CONSTRAINT IF EXISTS groups_department_id_fk CASCADE;
ALTER TABLE juvity.groups ADD CONSTRAINT groups_department_id_fk FOREIGN KEY (department_id)
REFERENCES juvity.departments (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: "departmentsFacultyIdFK" | type: CONSTRAINT --
-- ALTER TABLE juvity.departments DROP CONSTRAINT IF EXISTS "departmentsFacultyIdFK" CASCADE;
ALTER TABLE juvity.departments ADD CONSTRAINT "departmentsFacultyIdFK" FOREIGN KEY (faculty_id)
REFERENCES juvity.faculties (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: "groupLessonsGroupIdFK" | type: CONSTRAINT --
-- ALTER TABLE juvity.group_lessons DROP CONSTRAINT IF EXISTS "groupLessonsGroupIdFK" CASCADE;
ALTER TABLE juvity.group_lessons ADD CONSTRAINT "groupLessonsGroupIdFK" FOREIGN KEY (group_id)
REFERENCES juvity.groups (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: "groupLessonsLessonIdFK" | type: CONSTRAINT --
-- ALTER TABLE juvity.group_lessons DROP CONSTRAINT IF EXISTS "groupLessonsLessonIdFK" CASCADE;
ALTER TABLE juvity.group_lessons ADD CONSTRAINT "groupLessonsLessonIdFK" FOREIGN KEY (lesson_id)
REFERENCES juvity.lessons (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: "instituteUniversityIdFK" | type: CONSTRAINT --
-- ALTER TABLE juvity.institutions DROP CONSTRAINT IF EXISTS "instituteUniversityIdFK" CASCADE;
ALTER TABLE juvity.institutions ADD CONSTRAINT "instituteUniversityIdFK" FOREIGN KEY (university_id)
REFERENCES juvity.universities (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: "sessionUserIDFK" | type: CONSTRAINT --
-- ALTER TABLE juvity.sessions DROP CONSTRAINT IF EXISTS "sessionUserIDFK" CASCADE;
ALTER TABLE juvity.sessions ADD CONSTRAINT "sessionUserIDFK" FOREIGN KEY (user_id)
REFERENCES juvity.users (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: "userWorkerUniversityIDFK" | type: CONSTRAINT --
-- ALTER TABLE juvity.user_workers DROP CONSTRAINT IF EXISTS "userWorkerUniversityIDFK" CASCADE;
ALTER TABLE juvity.user_workers ADD CONSTRAINT "userWorkerUniversityIDFK" FOREIGN KEY (university_id)
REFERENCES juvity.universities (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: "userWorkerInstituteIDFK" | type: CONSTRAINT --
-- ALTER TABLE juvity.user_workers DROP CONSTRAINT IF EXISTS "userWorkerInstituteIDFK" CASCADE;
ALTER TABLE juvity.user_workers ADD CONSTRAINT "userWorkerInstituteIDFK" FOREIGN KEY (instutute_id)
REFERENCES juvity.institutions (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: "userWorkerUserIDFK" | type: CONSTRAINT --
-- ALTER TABLE juvity.user_workers DROP CONSTRAINT IF EXISTS "userWorkerUserIDFK" CASCADE;
ALTER TABLE juvity.user_workers ADD CONSTRAINT "userWorkerUserIDFK" FOREIGN KEY (user_id)
REFERENCES juvity.users (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: "userWorkerFacultyIDFK" | type: CONSTRAINT --
-- ALTER TABLE juvity.user_workers DROP CONSTRAINT IF EXISTS "userWorkerFacultyIDFK" CASCADE;
ALTER TABLE juvity.user_workers ADD CONSTRAINT "userWorkerFacultyIDFK" FOREIGN KEY (faculty_id)
REFERENCES juvity.faculties (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: "facultiesInstituteIdFK" | type: CONSTRAINT --
-- ALTER TABLE juvity.faculties DROP CONSTRAINT IF EXISTS "facultiesInstituteIdFK" CASCADE;
ALTER TABLE juvity.faculties ADD CONSTRAINT "facultiesInstituteIdFK" FOREIGN KEY (institute_id)
REFERENCES juvity.institutions (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: group_students_group_id_fk | type: CONSTRAINT --
-- ALTER TABLE juvity.group_students DROP CONSTRAINT IF EXISTS group_students_group_id_fk CASCADE;
ALTER TABLE juvity.group_students ADD CONSTRAINT group_students_group_id_fk FOREIGN KEY (group_id)
REFERENCES juvity.groups (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: group_students_student_id_fk | type: CONSTRAINT --
-- ALTER TABLE juvity.group_students DROP CONSTRAINT IF EXISTS group_students_student_id_fk CASCADE;
ALTER TABLE juvity.group_students ADD CONSTRAINT group_students_student_id_fk FOREIGN KEY (student_id)
REFERENCES juvity.students (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --


