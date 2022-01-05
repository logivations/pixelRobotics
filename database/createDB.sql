create database pixel_robotics;

use pixel_robotics;

create table user_activity
(
    ID              mediumint auto_increment
        primary key,
    user_IP         text       not null,
    visited_page    text       not null,
    date_time       datetime   not null default CURRENT_TIMESTAMP,
    cookie_detail   mediumtext not null,
    browser         text       not null,
    browser_detail  mediumtext not null,
    user_info       mediumtext not null,
    provider_detail mediumtext not null,
    referer         text       not null
);