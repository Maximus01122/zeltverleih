import React from 'react';
import EventNoteIcon from '@mui/icons-material/EventNote';
import ConstructionIcon from '@mui/icons-material/Construction';
import {FaWarehouse} from "react-icons/fa";
import {IoStatsChart} from "react-icons/io5";
import {IoBagAdd} from "react-icons/io5";

export const AdminSidebarData = [

  {
    title: 'Buchungsübersicht',
    path: '/',
    icon: <EventNoteIcon className="sidebarIcon" />,
    cName: 'nav-text'
  },
  {
    title: 'Lager',
    path: '/stock',
    icon: <FaWarehouse className="sidebarIcon" color={"black"} />,
    cName: 'nav-text'
  },
  {
    title: 'neue Bestellung',
    path: '/newBooking',
    icon: <IoBagAdd className="sidebarIcon" color={"black"}/>,
    cName: 'nav-text'
  },
  {
    title: 'Equipment',
    path: '/materialien',
    icon:  <ConstructionIcon className="sidebarIcon"/>,
    cName: 'nav-text'
  },
  {
    title: 'Statistiken',
    path: '/statistiken',
    icon:  <IoStatsChart className="sidebarIcon" color={"black"}/>,
    cName: 'nav-text'
  }
];
