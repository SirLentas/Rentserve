--
-- PostgreSQL database dump
--

-- Dumped from database version 10.12 (Ubuntu 10.12-0ubuntu0.18.04.1)
-- Dumped by pg_dump version 10.12 (Ubuntu 10.12-0ubuntu0.18.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: type_of_house; Type: TYPE; Schema: public; Owner: sirlentas
--

CREATE TYPE public.type_of_house AS ENUM (
    'private room',
    'public room',
    'house'
);


ALTER TYPE public.type_of_house OWNER TO sirlentas;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: hosts_houses; Type: TABLE; Schema: public; Owner: sirlentas
--

CREATE TABLE public.hosts_houses (
    house_id bigint NOT NULL,
    host_id bigint NOT NULL
);


ALTER TABLE public.hosts_houses OWNER TO sirlentas;

--
-- Name: houses; Type: TABLE; Schema: public; Owner: sirlentas
--

CREATE TABLE public.houses (
    house_id bigint NOT NULL,
    country character varying NOT NULL,
    city character varying NOT NULL,
    adress character varying NOT NULL,
    capacity integer DEFAULT 2 NOT NULL,
    available_from date NOT NULL,
    available_to date NOT NULL,
    house_name character varying NOT NULL,
    size integer NOT NULL,
    cost integer NOT NULL,
    house_type public.type_of_house,
    heating boolean,
    wifi boolean,
    cooling boolean,
    oven boolean,
    tv boolean,
    parking boolean,
    elevator boolean,
    description character varying,
    min_days integer,
    extra_info character varying,
    images character varying[],
    lat text,
    lng text
);


ALTER TABLE public.houses OWNER TO sirlentas;

--
-- Name: houses_house_id_seq; Type: SEQUENCE; Schema: public; Owner: sirlentas
--

CREATE SEQUENCE public.houses_house_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.houses_house_id_seq OWNER TO sirlentas;

--
-- Name: houses_house_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sirlentas
--

ALTER SEQUENCE public.houses_house_id_seq OWNED BY public.houses.house_id;


--
-- Name: messages; Type: TABLE; Schema: public; Owner: sirlentas
--

CREATE TABLE public.messages (
    message_id integer NOT NULL,
    sender integer,
    receiver integer,
    about character varying,
    text character varying,
    date date
);


ALTER TABLE public.messages OWNER TO sirlentas;

--
-- Name: messages_message_id_seq; Type: SEQUENCE; Schema: public; Owner: sirlentas
--

ALTER TABLE public.messages ALTER COLUMN message_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.messages_message_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: reservations; Type: TABLE; Schema: public; Owner: sirlentas
--

CREATE TABLE public.reservations (
    reservation_id integer NOT NULL,
    house_reserved bigint NOT NULL,
    in_date date NOT NULL,
    out_date date NOT NULL,
    renter_id bigint NOT NULL
);


ALTER TABLE public.reservations OWNER TO sirlentas;

--
-- Name: reservations_reservation_id_seq; Type: SEQUENCE; Schema: public; Owner: sirlentas
--

ALTER TABLE public.reservations ALTER COLUMN reservation_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.reservations_reservation_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: sirlentas
--

CREATE TABLE public.reviews (
    review_id integer NOT NULL,
    reviewer_id integer,
    house_id integer,
    grade real,
    text character varying
);


ALTER TABLE public.reviews OWNER TO sirlentas;

--
-- Name: reviews_review_id_seq; Type: SEQUENCE; Schema: public; Owner: sirlentas
--

ALTER TABLE public.reviews ALTER COLUMN review_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.reviews_review_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: sirlentas
--

CREATE TABLE public.users (
    user_id bigint NOT NULL,
    is_admin boolean NOT NULL,
    is_host boolean NOT NULL,
    username character varying NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    host_appl boolean,
    profile_pic character varying,
    phone character varying
);


ALTER TABLE public.users OWNER TO sirlentas;

--
-- Name: user_user_id_seq; Type: SEQUENCE; Schema: public; Owner: sirlentas
--

CREATE SEQUENCE public.user_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_user_id_seq OWNER TO sirlentas;

--
-- Name: user_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sirlentas
--

ALTER SEQUENCE public.user_user_id_seq OWNED BY public.users.user_id;


--
-- Name: houses house_id; Type: DEFAULT; Schema: public; Owner: sirlentas
--

ALTER TABLE ONLY public.houses ALTER COLUMN house_id SET DEFAULT nextval('public.houses_house_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: sirlentas
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.user_user_id_seq'::regclass);


--
-- Data for Name: hosts_houses; Type: TABLE DATA; Schema: public; Owner: sirlentas
--

COPY public.hosts_houses (house_id, host_id) FROM stdin;
34	57
35	57
36	57
37	57
38	57
39	57
40	58
41	58
42	58
43	58
44	58
45	58
\.


--
-- Data for Name: houses; Type: TABLE DATA; Schema: public; Owner: sirlentas
--

COPY public.houses (house_id, country, city, adress, capacity, available_from, available_to, house_name, size, cost, house_type, heating, wifi, cooling, oven, tv, parking, elevator, description, min_days, extra_info, images, lat, lng) FROM stdin;
35	Greece	Athina	Akadimias 1	5	2020-09-18	2021-05-31	Cool House	100	50	house	t	t	f	t	f	f	f	Test House	1	No specific rules ...\n                      	{multi-files-1600444060616,multi-files-1600444060620,multi-files-1600444060621,multi-files-1600444060622}	37.97658998890621	23.737490029883332
36	Greece	Zografos	Maikina 1	3	2020-09-18	2021-05-31	Student Place	40	10	house	f	t	f	t	t	f	f	Near University of Athens.	1	No specific rules ...\n                      	{multi-files-1600444060616,multi-files-1600444060620,multi-files-1600444060621,multi-files-1600444060622}	37.97343998587385	23.77390998591386
37	Greece	Zografos	Chrysippou 1	5	2020-09-18	2021-05-31	To Magiko	200	80	house	f	t	f	t	f	f	f	Near University of Athens.	5	No specific rules ...\n                      	{multi-files-1600444060616,multi-files-1600444060620,multi-files-1600444060621,multi-files-1600444060622}	37.97914998977406	23.76350997191085
38	Greece	Zografos	Seilistrias 1	2	2020-09-18	2021-05-31	Cozy Room	20	10	private room	f	t	f	t	t	f	f	A small beautiful room.	2	No pets allowed !\n                      	{multi-files-1600444060616,multi-files-1600444060620,multi-files-1600444060621,multi-files-1600444060622}	37.973400004195696	23.7660800310625
39	Greece	Zografos	Chlois 14	1	2020-09-18	2021-05-31	Public Room with a View	20	10	public room	f	t	f	t	f	f	f	Share a room, make friends...	1	No specific rules ...\n                      	{multi-files-1600444060616,multi-files-1600444060620,multi-files-1600444060621,multi-files-1600444060622}	37.973000019776165	23.776469986781706
40	Greece	Vyronas	Aroni 6	3	2020-09-18	2021-05-31	Laura's Place	74	44	private room	f	t	f	t	t	t	f	Perfect house for a couple	2	Pets allowed \n                      	{multi-files-1600444060616,multi-files-1600444060620,multi-files-1600444060621,multi-files-1600444060622}	37.96281001435723	23.753580015037954
34	Greece	Athina	Kriton 39	2	2020-09-18	2021-05-31	Aristotle's Houses	60	20	house	t	t	f	t	t	t	t	Cozy house, near 'Neos Kosmos' metro station.	2	No pets allowed !\n                      	{multi-files-1600444060616,multi-files-1600444060620,multi-files-1600444060621,multi-files-1600444060622}	37.95331998167248	23.724370004480875
41	Greece	Vyronas	Chremonidou 52	4	2020-09-18	2021-05-31	Vyronas Place	69	28	house	t	t	t	t	t	f	t	Near Jumbo	2	Check-in before 5PM\n                      	{multi-files-1600444060616,multi-files-1600444060620,multi-files-1600444060621,multi-files-1600444060622}	37.96453999726313	23.751029988634883
42	Greece	Athina	Tsakalof 5	6	2020-09-18	2021-05-31	Kolonaki Party Place	110	300	house	t	t	t	t	t	t	t	Penthouse With View to Acropolis	2	Party till 2AM\n                      	{multi-files-1600444060616,multi-files-1600444060620,multi-files-1600444060621,multi-files-1600444060622}	37.97768001350467	23.74068998905861
43	Greece	Athina	Kolokotroni 56	4	2020-09-18	2021-05-31	City Center Apartment	93	90	house	t	t	t	t	t	f	t	In the heart of Athens	2	Check-in before 4PM\n                      	{multi-files-1600444060616,multi-files-1600444060620,multi-files-1600444060621,multi-files-1600444060622}	37.97781999128769	23.72874996798521
44	Greece	Vyronas	Nikiforidi Nik. 45	2	2020-09-18	2021-05-31	Lord Byron's 	30	15	private room	t	t	t	t	f	f	t	Suitable for couples	1	Check-out Before 12PM\n                      	{multi-files-1600444060616,multi-files-1600444060620,multi-files-1600444060621,multi-files-1600444060622}	37.96498997973511	23.755759980415803
45	Greece	Vyronas	Leoforos Kyprou 4	3	2020-09-18	2021-05-31	Gefyra Apartment	45	27	house	t	t	t	t	t	t	t	Near Gefyra bus station.	2	No specific rules.\n                      	{multi-files-1600444060616,multi-files-1600444060620,multi-files-1600444060621,multi-files-1600444060622}	37.9638699898328	23.750829996425125
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: sirlentas
--

COPY public.messages (message_id, sender, receiver, about, text, date) FROM stdin;
30	60	57	Cool House	Can i bring my dog?	2020-09-19
\.


--
-- Data for Name: reservations; Type: TABLE DATA; Schema: public; Owner: sirlentas
--

COPY public.reservations (reservation_id, house_reserved, in_date, out_date, renter_id) FROM stdin;
37	35	2021-05-01	2021-05-04	62
38	41	2021-05-01	2021-05-03	62
39	35	2021-05-05	2021-05-07	60
40	35	2021-05-07	2021-05-09	61
41	35	2021-05-09	2021-05-11	58
42	35	2021-05-11	2021-05-13	59
43	36	2021-05-01	2021-05-03	59
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: sirlentas
--

COPY public.reviews (review_id, reviewer_id, house_id, grade, text) FROM stdin;
32	62	35	5	Very 'cool' House ;)
33	62	41	4	Not close to a metro station but just fine!
34	60	35	4	Good place
35	61	35	5	Perfect Host!
36	58	35	3	Fine place.
37	59	35	5	Very helpful host!
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: sirlentas
--

COPY public.users (user_id, is_admin, is_host, username, email, password, host_appl, profile_pic, phone) FROM stdin;
56	t	f	admin	admin	$2b$10$9R0/WROrzAgZKB8YlN7MduyGYolkgH08.GqIxjrJlxqSMPC.jB5Ka	f	default.png	0000000000
57	f	t	Kyriakos	kyriakos@example.com	$2b$10$bcPEbx2ZV7.Nvh2Gbdlb1uGxviSulJB9jZlUxQhvMAGU3KFD1DUO2	f	default.png	0123456789
58	f	t	Constantinos	con@example.com	$2b$10$vljjquU0lkt0yfBuqrcUgeglXpfpwBJfQLqfsgNKKll5xyu13fEQi	f	default.png	0123456789
59	f	f	Sir	Sir@example.com	$2b$10$6IUZdfRdRZNv7JQn/Vds6eY7tiboB/cszoX.Gn5kl4r6O.tbLSum.	f	default.png	1234567890
60	f	f	Nancy	nancy@example.com	$2b$10$nskXRcK6UvwfV9W8rpSrSO1H./l1cMgaoqo7mwXA99eaSFJ1ExIM2	f	default.png	1234567890
61	f	f	Ann	anna@example.com	$2b$10$QEJ5JjXXo1Hpkb6fPGyS7.WbZBtggCWxyW9jHCCSeQFyWfSgDRu4K	t	default.png	1234567890
62	f	f	Aris	aris@example.com	$2b$10$2k..UjfFYq21ItydFsRO/.zECvdwp7N08a8RopEY998pdfnej372K	f	default.png	1234567890
\.


--
-- Name: houses_house_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sirlentas
--

SELECT pg_catalog.setval('public.houses_house_id_seq', 46, true);


--
-- Name: messages_message_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sirlentas
--

SELECT pg_catalog.setval('public.messages_message_id_seq', 30, true);


--
-- Name: reservations_reservation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sirlentas
--

SELECT pg_catalog.setval('public.reservations_reservation_id_seq', 43, true);


--
-- Name: reviews_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sirlentas
--

SELECT pg_catalog.setval('public.reviews_review_id_seq', 37, true);


--
-- Name: user_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sirlentas
--

SELECT pg_catalog.setval('public.user_user_id_seq', 62, true);


--
-- Name: houses houses_pk; Type: CONSTRAINT; Schema: public; Owner: sirlentas
--

ALTER TABLE ONLY public.houses
    ADD CONSTRAINT houses_pk PRIMARY KEY (house_id);


--
-- Name: houses houses_un; Type: CONSTRAINT; Schema: public; Owner: sirlentas
--

ALTER TABLE ONLY public.houses
    ADD CONSTRAINT houses_un UNIQUE (house_id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: sirlentas
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (message_id);


--
-- Name: hosts_houses primary_k; Type: CONSTRAINT; Schema: public; Owner: sirlentas
--

ALTER TABLE ONLY public.hosts_houses
    ADD CONSTRAINT primary_k PRIMARY KEY (house_id);


--
-- Name: reservations reservations_pkey; Type: CONSTRAINT; Schema: public; Owner: sirlentas
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_pkey PRIMARY KEY (reservation_id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: sirlentas
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (review_id);


--
-- Name: users user_pkey; Type: CONSTRAINT; Schema: public; Owner: sirlentas
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT user_pkey PRIMARY KEY (user_id);


--
-- Name: fki_fk_host; Type: INDEX; Schema: public; Owner: sirlentas
--

CREATE INDEX fki_fk_host ON public.hosts_houses USING btree (host_id);


--
-- Name: fki_fk_house; Type: INDEX; Schema: public; Owner: sirlentas
--

CREATE INDEX fki_fk_house ON public.hosts_houses USING btree (house_id);


--
-- Name: fki_fk_renter; Type: INDEX; Schema: public; Owner: sirlentas
--

CREATE INDEX fki_fk_renter ON public.reservations USING btree (renter_id);


--
-- Name: messages fk_from; Type: FK CONSTRAINT; Schema: public; Owner: sirlentas
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT fk_from FOREIGN KEY (sender) REFERENCES public.users(user_id);


--
-- Name: hosts_houses fk_host; Type: FK CONSTRAINT; Schema: public; Owner: sirlentas
--

ALTER TABLE ONLY public.hosts_houses
    ADD CONSTRAINT fk_host FOREIGN KEY (host_id) REFERENCES public.users(user_id) MATCH FULL;


--
-- Name: reservations fk_house; Type: FK CONSTRAINT; Schema: public; Owner: sirlentas
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT fk_house FOREIGN KEY (house_reserved) REFERENCES public.houses(house_id);


--
-- Name: hosts_houses fk_house; Type: FK CONSTRAINT; Schema: public; Owner: sirlentas
--

ALTER TABLE ONLY public.hosts_houses
    ADD CONSTRAINT fk_house FOREIGN KEY (house_id) REFERENCES public.houses(house_id) MATCH FULL;


--
-- Name: reviews fk_house; Type: FK CONSTRAINT; Schema: public; Owner: sirlentas
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT fk_house FOREIGN KEY (house_id) REFERENCES public.houses(house_id);


--
-- Name: reviews fk_reviewer; Type: FK CONSTRAINT; Schema: public; Owner: sirlentas
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT fk_reviewer FOREIGN KEY (reviewer_id) REFERENCES public.users(user_id);


--
-- Name: messages fk_to; Type: FK CONSTRAINT; Schema: public; Owner: sirlentas
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT fk_to FOREIGN KEY (receiver) REFERENCES public.users(user_id);


--
-- Name: reservations fk_user; Type: FK CONSTRAINT; Schema: public; Owner: sirlentas
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT fk_user FOREIGN KEY (renter_id) REFERENCES public.users(user_id) MATCH FULL;


--
-- PostgreSQL database dump complete
--

