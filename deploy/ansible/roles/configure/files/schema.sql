--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: mobilevis; Type: DATABASE; Schema: -; Owner: bocoup
--

CREATE DATABASE mobilevis WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_US.UTF-8' LC_CTYPE = 'en_US.UTF-8';


ALTER DATABASE mobilevis OWNER TO bocoup;

\connect mobilevis

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner:
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: comments; Type: TABLE; Schema: public; Owner: bocoup; Tablespace:
--

CREATE TABLE comments (
    id integer NOT NULL,
    twitter_handle text NOT NULL,
    comment text NOT NULL,
    submission_id integer NOT NULL,
    "timestamp" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.comments OWNER TO bocoup;

--
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: bocoup
--

CREATE SEQUENCE comments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.comments_id_seq OWNER TO bocoup;

--
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bocoup
--

ALTER SEQUENCE comments_id_seq OWNED BY comments.id;


--
-- Name: images; Type: TABLE; Schema: public; Owner: bocoup; Tablespace:
--

CREATE TABLE images (
    id integer NOT NULL,
    submission_id integer NOT NULL,
    url text NOT NULL,
    "timestamp" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.images OWNER TO bocoup;

--
-- Name: images_id_seq; Type: SEQUENCE; Schema: public; Owner: bocoup
--

CREATE SEQUENCE images_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.images_id_seq OWNER TO bocoup;

--
-- Name: images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bocoup
--

ALTER SEQUENCE images_id_seq OWNED BY images.id;


--
-- Name: knex_version; Type: TABLE; Schema: public; Owner: bocoup; Tablespace:
--

CREATE TABLE knex_version (
    id integer NOT NULL,
    name character varying(255),
    batch integer,
    migration_time timestamp without time zone
);


ALTER TABLE public.knex_version OWNER TO bocoup;

--
-- Name: knex_version_id_seq; Type: SEQUENCE; Schema: public; Owner: bocoup
--

CREATE SEQUENCE knex_version_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.knex_version_id_seq OWNER TO bocoup;

--
-- Name: knex_version_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bocoup
--

ALTER SEQUENCE knex_version_id_seq OWNED BY knex_version.id;


--
-- Name: submission_tags; Type: TABLE; Schema: public; Owner: bocoup; Tablespace:
--

CREATE TABLE submission_tags (
    id integer NOT NULL,
    tag_id integer NOT NULL,
    submission_id integer NOT NULL,
    "timestamp" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.submission_tags OWNER TO bocoup;

--
-- Name: submission_tags_id_seq; Type: SEQUENCE; Schema: public; Owner: bocoup
--

CREATE SEQUENCE submission_tags_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.submission_tags_id_seq OWNER TO bocoup;

--
-- Name: submission_tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bocoup
--

ALTER SEQUENCE submission_tags_id_seq OWNED BY submission_tags.id;


--
-- Name: submissions; Type: TABLE; Schema: public; Owner: bocoup; Tablespace:
--

CREATE TABLE submissions (
    id integer NOT NULL,
    twitter_handle text NOT NULL,
    name text NOT NULL,
    creator text,
    original_url text,
    "timestamp" timestamp without time zone DEFAULT now() NOT NULL,
    is_published boolean DEFAULT false,
    description text
);


ALTER TABLE public.submissions OWNER TO bocoup;

--
-- Name: submissions_id_seq; Type: SEQUENCE; Schema: public; Owner: bocoup
--

CREATE SEQUENCE submissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.submissions_id_seq OWNER TO bocoup;

--
-- Name: submissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bocoup
--

ALTER SEQUENCE submissions_id_seq OWNED BY submissions.id;


--
-- Name: tags; Type: TABLE; Schema: public; Owner: bocoup; Tablespace:
--

CREATE TABLE tags (
    id integer NOT NULL,
    tag text NOT NULL,
    "timestamp" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.tags OWNER TO bocoup;

--
-- Name: tags_id_seq; Type: SEQUENCE; Schema: public; Owner: bocoup
--

CREATE SEQUENCE tags_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tags_id_seq OWNER TO bocoup;

--
-- Name: tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bocoup
--

ALTER SEQUENCE tags_id_seq OWNED BY tags.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: bocoup
--

ALTER TABLE ONLY comments ALTER COLUMN id SET DEFAULT nextval('comments_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: bocoup
--

ALTER TABLE ONLY images ALTER COLUMN id SET DEFAULT nextval('images_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: bocoup
--

ALTER TABLE ONLY knex_version ALTER COLUMN id SET DEFAULT nextval('knex_version_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: bocoup
--

ALTER TABLE ONLY submission_tags ALTER COLUMN id SET DEFAULT nextval('submission_tags_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: bocoup
--

ALTER TABLE ONLY submissions ALTER COLUMN id SET DEFAULT nextval('submissions_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: bocoup
--

ALTER TABLE ONLY tags ALTER COLUMN id SET DEFAULT nextval('tags_id_seq'::regclass);


--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: bocoup
--

COPY comments (id, twitter_handle, comment, submission_id, "timestamp") FROM stdin;
\.


--
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bocoup
--

SELECT pg_catalog.setval('comments_id_seq', 1, false);


--
-- Data for Name: images; Type: TABLE DATA; Schema: public; Owner: bocoup
--

COPY images (id, submission_id, url, "timestamp") FROM stdin;
\.


--
-- Name: images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bocoup
--

SELECT pg_catalog.setval('images_id_seq', 2, true);


--
-- Data for Name: knex_version; Type: TABLE DATA; Schema: public; Owner: bocoup
--

COPY knex_version (id, name, batch, migration_time) FROM stdin;
1 001-submissions.js  1 2014-05-26 20:14:40.22
2 002-images.js 1 2014-05-26 20:14:40.247
3 003-tags.js 1 2014-05-26 20:14:40.259
4 004-submission_tags.js  1 2014-05-26 20:14:40.272
5 005-comments.js 1 2014-05-26 20:14:40.286
6 006-add-description-to-submission.js  1 2014-05-26 20:14:40.291
\.


--
-- Name: knex_version_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bocoup
--

SELECT pg_catalog.setval('knex_version_id_seq', 6, true);


--
-- Data for Name: submission_tags; Type: TABLE DATA; Schema: public; Owner: bocoup
--

COPY submission_tags (id, tag_id, submission_id, "timestamp") FROM stdin;
\.


--
-- Name: submission_tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bocoup
--

SELECT pg_catalog.setval('submission_tags_id_seq', 3, true);


--
-- Data for Name: submissions; Type: TABLE DATA; Schema: public; Owner: bocoup
--

COPY submissions (id, twitter_handle, name, creator, original_url, "timestamp", is_published, description) FROM stdin;
\.


--
-- Name: submissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bocoup
--

SELECT pg_catalog.setval('submissions_id_seq', 1, true);


--
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: bocoup
--

COPY tags (id, tag, "timestamp") FROM stdin;
1 tag1  2014-05-26 20:15:14.229818
2  tag2 2014-05-26 20:15:14.239638
3  tag3 2014-05-26 20:15:14.247772
\.


--
-- Name: tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bocoup
--

SELECT pg_catalog.setval('tags_id_seq', 3, true);


--
-- Name: comments_pkey; Type: CONSTRAINT; Schema: public; Owner: bocoup; Tablespace:
--

ALTER TABLE ONLY comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- Name: images_pkey; Type: CONSTRAINT; Schema: public; Owner: bocoup; Tablespace:
--

ALTER TABLE ONLY images
    ADD CONSTRAINT images_pkey PRIMARY KEY (id);


--
-- Name: knex_version_pkey; Type: CONSTRAINT; Schema: public; Owner: bocoup; Tablespace:
--

ALTER TABLE ONLY knex_version
    ADD CONSTRAINT knex_version_pkey PRIMARY KEY (id);


--
-- Name: submission_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: bocoup; Tablespace:
--

ALTER TABLE ONLY submission_tags
    ADD CONSTRAINT submission_tags_pkey PRIMARY KEY (id);


--
-- Name: submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: bocoup; Tablespace:
--

ALTER TABLE ONLY submissions
    ADD CONSTRAINT submissions_pkey PRIMARY KEY (id);


--
-- Name: tags_pkey; Type: CONSTRAINT; Schema: public; Owner: bocoup; Tablespace:
--

ALTER TABLE ONLY tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- Name: comments_submission_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: bocoup
--

ALTER TABLE ONLY comments
    ADD CONSTRAINT comments_submission_id_foreign FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE;


--
-- Name: images_submission_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: bocoup
--

ALTER TABLE ONLY images
    ADD CONSTRAINT images_submission_id_foreign FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE;


--
-- Name: submission_tags_submission_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: bocoup
--

ALTER TABLE ONLY submission_tags
    ADD CONSTRAINT submission_tags_submission_id_foreign FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE;


--
-- Name: submission_tags_tag_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: bocoup
--

ALTER TABLE ONLY submission_tags
    ADD CONSTRAINT submission_tags_tag_id_foreign FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE;


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

