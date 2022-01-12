create database if not exists pixel_robotics;

use pixel_robotics;

create table if not exists user_activity
(
    ID                  varchar(64)    not null,
    user_IP             varchar(48)    not null,
    visited_page        varchar(48)    not null,
    user_agent          varchar(255)   not null,
    provider_detail     varchar(255)    not null,
    date_time           datetime       not null default CURRENT_TIMESTAMP,
    cookie_detail       varchar(255)   not null default '',
    number_of_visits    int            not null default 0,
    plugins             varchar(64)    not null default '',
    resolution          varchar(32)    not null default '',
    referer             varchar(255)   not null default '',
    primary key (user_IP, visited_page, user_agent, provider_detail)
) engine=InnoDB default charset=latin1;