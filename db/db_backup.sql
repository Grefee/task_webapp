PGDMP     !    1                {            TaskList_veryNew    14.5    14.5                0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    98492    TaskList_veryNew    DATABASE     n   CREATE DATABASE "TaskList_veryNew" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'Czech_Czechia.1250';
 "   DROP DATABASE "TaskList_veryNew";
                postgres    false            �            1259    98555    history_history_id_seq    SEQUENCE        CREATE SEQUENCE public.history_history_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.history_history_id_seq;
       public          postgres    false            �            1259    98548    history    TABLE     c  CREATE TABLE public.history (
    history_id integer DEFAULT nextval('public.history_history_id_seq'::regclass) NOT NULL,
    history_task_id integer,
    history_user_id character varying,
    history_date_time timestamp without time zone,
    task_requester character varying(255),
    task_to character varying(255),
    task_priority character varying(255),
    task_description text,
    task_finaltimedate timestamp without time zone,
    task_status character varying(255),
    task_filelink text,
    task_email character varying(255),
    task_show integer,
    task_comment character varying(1000)
);
    DROP TABLE public.history;
       public         heap    postgres    false    214            �            1259    98494    tasks    TABLE     +  CREATE TABLE public.tasks (
    task_id integer NOT NULL,
    task_requester character varying(255),
    task_to character varying(255),
    task_priority character varying(255),
    task_description text,
    task_finaltimedate timestamp without time zone,
    task_status character varying(255),
    task_filelink character varying(255),
    task_email character varying(255),
    task_show integer,
    task_creation_time timestamp without time zone,
    task_finished_date_time timestamp without time zone,
    task_comment character varying(1000)
);
    DROP TABLE public.tasks;
       public         heap    postgres    false            �            1259    98493    tasks_task_id_seq    SEQUENCE     �   CREATE SEQUENCE public.tasks_task_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.tasks_task_id_seq;
       public          postgres    false    210                       0    0    tasks_task_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.tasks_task_id_seq OWNED BY public.tasks.task_id;
          public          postgres    false    209            �            1259    98520    users_user_id_seq    SEQUENCE     z   CREATE SEQUENCE public.users_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.users_user_id_seq;
       public          postgres    false            �            1259    98513    users    TABLE       CREATE TABLE public.users (
    user_id bigint DEFAULT nextval('public.users_user_id_seq'::regclass) NOT NULL,
    user_name character varying(255),
    user_password character varying(255),
    user_active integer NOT NULL,
    user_acctype character varying(255) NOT NULL
);
    DROP TABLE public.users;
       public         heap    postgres    false    212            f           2604    98497    tasks task_id    DEFAULT     n   ALTER TABLE ONLY public.tasks ALTER COLUMN task_id SET DEFAULT nextval('public.tasks_task_id_seq'::regclass);
 <   ALTER TABLE public.tasks ALTER COLUMN task_id DROP DEFAULT;
       public          postgres    false    210    209    210            �          0    98548    history 
   TABLE DATA           �   COPY public.history (history_id, history_task_id, history_user_id, history_date_time, task_requester, task_to, task_priority, task_description, task_finaltimedate, task_status, task_filelink, task_email, task_show, task_comment) FROM stdin;
    public          postgres    false    213   �       �          0    98494    tasks 
   TABLE DATA           �   COPY public.tasks (task_id, task_requester, task_to, task_priority, task_description, task_finaltimedate, task_status, task_filelink, task_email, task_show, task_creation_time, task_finished_date_time, task_comment) FROM stdin;
    public          postgres    false    210           �          0    98513    users 
   TABLE DATA           ]   COPY public.users (user_id, user_name, user_password, user_active, user_acctype) FROM stdin;
    public          postgres    false    211   O#                  0    0    history_history_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.history_history_id_seq', 233, true);
          public          postgres    false    214                       0    0    tasks_task_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.tasks_task_id_seq', 129, true);
          public          postgres    false    209            	           0    0    users_user_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.users_user_id_seq', 37, true);
          public          postgres    false    212            n           2606    98557    history history_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.history
    ADD CONSTRAINT history_pkey PRIMARY KEY (history_id);
 >   ALTER TABLE ONLY public.history DROP CONSTRAINT history_pkey;
       public            postgres    false    213            j           2606    98501    tasks tasks_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (task_id);
 :   ALTER TABLE ONLY public.tasks DROP CONSTRAINT tasks_pkey;
       public            postgres    false    210            l           2606    98527    users users_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    211            �   �  x��͎�6��ڧ���)��iZ�k�E�(Z����%C��z� �P�� ���W�e���!���ZQ	[H�2 K��G��Rm"�H��<b����!�!"��<�,�l����'����5�*��=�u��E�":!��b�FMZOѸ�ic�3o|k���1�� �jU�h�Ȁ  h�N(�D ����= �`����6{3�{��P� �˼��	�l
4���_	�C
,�Q���A;vC�0����/����o��-��Z��{�w]��j�{-�nl	�!��	1X�(-�u�uYf5����+�_Te}�n��tV���7hq��͊�n�~GY����s��Y��}kǓb��_<���'�<>�y�=cD阡tsk�����@���Ng�ū������2�������h?�N�8�1�*M�}��[�u��'h�ȍ>���7E���+"�ÏFO'�b��\��F>�ݼͦk7�G?������o��-n��z���{C!>�?�N�I�L�M	]��].3��7�`�`i�U�1f�!�:���}�����i���G���k�� KlZ��t�(��n��,���*��f�s���G��Q^4��U^7����u����%PV���xt�F�	�U��2����>y�e�砟g�/�N_ԓ�e�v�J8�Ҙ����f6�l��a��b	�����l�m�y��.�*S!�b�]q8b���	0��,l�e� T�$�$�`A�f����)��\�>��=��lDو@�'�n9�Z�ݶ�HO�v��P��Pl��]g\� ��@���3"�o�*K��J����,abkսr����Nז���	�����I��]YTث�m���5)"�H�ݹ�1޵��3I(�)eGwj'#NU۵�e�`x��i�~��M�.N���6�ZV�|z
�"�������՝�%��b��qR�&a��K ����Bs(1���(7���"]����6��;�ξИ�?"@`�(u&���"�!Au%�� C�0dBh"�J���
	�Z@�{(L"�NCLF���aa�0=�@���cPƀ�R�5=�n0h�vG|D�Q�d�ǐ4�Q�X��Q�$��T��GD%dr�� ZN�����p�X	ڑ��2��2;��=�Mt� ��¶���i��S.��,$�^�Wl���>-����>�M�O9w��L�c��'@Ɉ�s7e�!��q_ i
q�F�Tt8H�7@RW�
)>�C`��jl�"�:G)VCD$��
��!0��4`�Z/�d�,�P+w��%�8%�P���3�T�,�P+��C�� U&Ԁ�c>@��4PWx�!�̧ay��p�� +�E0�;(#��%�s|vv�/�!�<      �   %  x��UM��6^ӧ�*��HIf7�$h�8$@� @�1ٱ,�Hɉ�9B�M�&�\���
��x$eR̦�P�����G���[k׀W˕6�v��<.�o�k�[@1M�&$��	��'�%>�c
I*����S{.8C��A�t[®Q��3B)�F��k��N/u�ձܙ�~�e����߲���V���|�*��?5M���p��+���Gg/�<}���b�>|Mq����<K�-�4b��H8{)�R��4K����s�[��vȄ	'�c1PJ���Y���RE<�T ��qx�*��41�B�U��R�.}x�|L��%�pU�Km��O|Hq���V����V�Sv��U��y�4�����1k,h��������$|.�`	̣}�SG�|�B%Z�A�H2AOM�Jnй��j����;��<)M[ۋҷ���}�������[�g�g�Q�y�W���Ѧ�A�/�1;�F=�j��j�.z�|�W��Hj�1XN%�
A3��"�k����X|W�w�]k�O	)�M�ű~�ȭ�Q?ԣ����f0�a�����)�3A�`)�g|�&���w���v������CBC�#��_<9��sD1���x=Pи�)a��k�^ou��P�]�ڟ=���=��	�=�B0r�2�,��W,(F�#{���1=��tqe�{0��E�^�7->]4�uhݹeY�`�rz��]Ov�T�B]�bv?��k�Dp��P1�.� ���*��P���S��)���RI�,"�0I�k������0+ACs.R5���ޢ�l�Ն3g      �   J   x�3��(�J-*�,H-HMO�4�LL����26�,I-.�/��L+3�R`�BNjbJj��9��xC�T51z\\\ T�     