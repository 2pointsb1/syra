import { ChevronLeft, ChevronRight, Plus, Bell, Eye, EyeOff, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import AddAppointmentModal from './AddAppointmentModal';
import AppointmentDetailsModal from './AppointmentDetailsModal';
import AppointmentDetailsWithLeadModal from './AppointmentDetailsWithLeadModal';
import ResizableAppointment from './ResizableAppointment';
import {
  parseTimeToMinutes,
  calculateAppointmentColumns,
  type AppointmentWithPosition
} from '../utils/calendarUtils';
import { getActiveProfile, UserProfile } from '../services/profileService';

interface CalendrierProps {
  onNotificationClick: () => void;
  notificationCount: number;
}

const mockCalendars = [
  { id: '1', name: 'Ornella Attard', color: 'blue' },
  { id: '2', name: 'Benjamin Zaoui', color: 'green' },
  { id: '3', name: 'Maor Assouline', color: 'orange' },
];

const getCurrentWeekDates = () => {
  const today = new Date();
  const currentDay = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return date;
  });
};

const getInitialAppointments = () => {
  const weekDates = getCurrentWeekDates();
  return [
    { id: '1', date: weekDates[0], title: 'RDV Mme DAHCHAR', time: '10:00', duration: 60, location: 'Bureau Paris', client_name: 'Madame DAHCHAR', leadName: 'Mme DAHCHAR', projectId: '1', collaborators: ['Marie Dubois', 'Jean Martin'], collaborator: 'Marie Dubois', reminder: true, notes: 'Premier rendez-vous avec Madame DAHCHAR pour discuter des options d\'assurance santé.' },
    { id: '2', date: weekDates[0], title: 'Présentation M. DUPART', time: '14:30', duration: 90, leadName: 'M. DUPART', projectId: '2', collaborators: ['Sophie Laurent'] },
    { id: '13', date: weekDates[0], title: 'Appel A. LEFEBVRE', time: '11:30', duration: 30, leadName: 'A. LEFEBVRE', projectId: '3', collaborators: ['Marie Dubois', 'Pierre Durand', 'Sophie Laurent'] },
    { id: '14', date: weekDates[0], title: 'Suivi B. ROUX', time: '16:00', duration: 45, leadName: 'B. ROUX', projectId: '1', collaborators: ['Jean Martin'] },
    { id: '31', date: weekDates[0], title: 'Appel Z. DUPUIS', time: '10:15', duration: 45, leadName: 'Z. DUPUIS', projectId: '2', collaborators: ['Sophie Laurent'] },
    { id: '32', date: weekDates[0], title: 'RDV X. MARTIN', time: '10:30', duration: 30, leadName: 'X. MARTIN', projectId: '3', collaborators: ['Jean Martin'] },
    { id: '3', date: weekDates[1], title: 'Consultation Y. GOASDOUE', time: '09:00', duration: 120, leadName: 'Y. GOASDOUE', projectId: '1', collaborators: ['Marie Dubois', 'Jean Martin', 'Pierre Durand'] },
    { id: '4', date: weekDates[1], title: 'RDV S. MARTIN', time: '11:00', duration: 60, leadName: 'S. MARTIN', projectId: '3', collaborators: ['Sophie Laurent', 'Pierre Durand'] },
    { id: '15', date: weekDates[1], title: 'Présentation C. GIRARD', time: '13:30', duration: 45, leadName: 'C. GIRARD', projectId: '2' },
    { id: '16', date: weekDates[1], title: 'RDV D. BLANC', time: '15:30', duration: 90, leadName: 'D. BLANC', projectId: '1' },
    { id: '5', date: weekDates[2], title: 'Suivi L. BERNARD', time: '15:00', duration: 30, leadName: 'L. BERNARD', projectId: '2' },
    { id: '6', date: weekDates[2], title: 'Appel J. DUPONT', time: '16:30', duration: 15, leadName: 'J. DUPONT', projectId: '1' },
    { id: '17', date: weekDates[2], title: 'RDV E. GARNIER', time: '09:30', duration: 60, leadName: 'E. GARNIER', projectId: '3' },
    { id: '18', date: weekDates[2], title: 'Consultation F. FAURE', time: '11:00', duration: 75, leadName: 'F. FAURE', projectId: '2' },
    { id: '19', date: weekDates[2], title: 'Présentation G. ANDRE', time: '14:00', duration: 90, leadName: 'G. ANDRE', projectId: '1' },
    { id: '20', date: weekDates[2], title: 'Suivi H. MERCIER', time: '17:00', duration: 45, leadName: 'H. MERCIER', projectId: '3' },
    { id: '7', date: weekDates[3], title: 'Présentation K. LEROY', time: '10:30', duration: 60, leadName: 'K. LEROY', projectId: '3' },
    { id: '8', date: weekDates[3], title: 'RDV P. MOREAU', time: '14:00', duration: 120, leadName: 'P. MOREAU', projectId: '2' },
    { id: '21', date: weekDates[3], title: 'Appel I. LAMBERT', time: '08:30', duration: 30, leadName: 'I. LAMBERT', projectId: '1' },
    { id: '22', date: weekDates[3], title: 'RDV J. BONNET', time: '16:00', duration: 45, leadName: 'J. BONNET', projectId: '3' },
    { id: '9', date: weekDates[4], title: 'Consultation R. PETIT', time: '09:30', duration: 90, leadName: 'R. PETIT', projectId: '1' },
    { id: '10', date: weekDates[4], title: 'RDV T. ROBERT', time: '15:00', duration: 60, leadName: 'T. ROBERT', projectId: '3' },
    { id: '23', date: weekDates[4], title: 'Présentation K. FRANCOIS', time: '11:00', duration: 45, leadName: 'K. FRANCOIS', projectId: '2' },
    { id: '24', date: weekDates[4], title: 'Suivi L. MARTINEZ', time: '13:30', duration: 30, leadName: 'L. MARTINEZ', projectId: '1' },
    { id: '25', date: weekDates[4], title: 'Appel M. LEGRAND', time: '16:30', duration: 15, leadName: 'M. LEGRAND', projectId: '3' },
    { id: '11', date: weekDates[5], title: 'Suivi V. RICHARD', time: '11:00', duration: 60, leadName: 'V. RICHARD', projectId: '2' },
    { id: '26', date: weekDates[5], title: 'RDV N. THOMAS', time: '09:00', duration: 90, leadName: 'N. THOMAS', projectId: '1' },
    { id: '27', date: weekDates[5], title: 'Consultation O. DAVID', time: '14:00', duration: 120, leadName: 'O. DAVID', projectId: '3' },
    { id: '28', date: weekDates[5], title: 'Présentation P. BERTRAND', time: '16:00', duration: 45, leadName: 'P. BERTRAND', projectId: '2' },
    { id: '12', date: weekDates[6], title: 'Présentation X. SIMON', time: '10:00', duration: 60, leadName: 'X. SIMON', projectId: '1' },
    { id: '29', date: weekDates[6], title: 'RDV Q. ROUSSEAU', time: '13:00', duration: 90, leadName: 'Q. ROUSSEAU', projectId: '3' },
    { id: '30', date: weekDates[6], title: 'Suivi R. VINCENT', time: '15:30', duration: 30, leadName: 'R. VINCENT', projectId: '2' },
  ];
};

const getColorClasses = (color: string, isBackground: boolean = true) => {
  const colors: { [key: string]: { bg: string; text: string } } = {
    blue: { bg: 'bg-blue-500/90', text: 'text-blue-600' },
    green: { bg: 'bg-green-500/90', text: 'text-green-600' },
    orange: { bg: 'bg-orange-500/90', text: 'text-orange-600' },
  };
  return isBackground ? colors[color]?.bg || colors.blue.bg : colors[color]?.text || colors.blue.text;
};

type CalendarView = 'day' | 'week' | 'month';

export default function Calendrier({ onNotificationClick, notificationCount }: CalendrierProps) {
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showEnhancedModal, setShowEnhancedModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<any>(null);
  const [newAppointmentTime, setNewAppointmentTime] = useState<{date: Date; hour: number} | null>(null);
  const [view, setView] = useState<CalendarView>('day');
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null);
  const [availableCalendars, setAvailableCalendars] = useState<typeof mockCalendars>([]);
  const [visibleCalendars, setVisibleCalendars] = useState<string[]>([]);
  const [showCalendarDropdown, setShowCalendarDropdown] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [draggedAppointment, setDraggedAppointment] = useState<any>(null);
  const [appointments, setAppointments] = useState(getInitialAppointments());
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [conflictInfo, setConflictInfo] = useState<{
    newAppointment: any;
    conflictingAppointment: any;
    newDate: Date;
  } | null>(null);

  const availableUsers = [
    { id: '1', name: 'Marie Dubois' },
    { id: '2', name: 'Jean Martin' },
    { id: '3', name: 'Sophie Laurent' },
    { id: '4', name: 'Pierre Durand' }
  ];
  const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const currentMonth = currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profile = await getActiveProfile();
      setCurrentProfile(profile);

      let calendarsToShow: typeof mockCalendars = [];

      if (!profile) {
        calendarsToShow = mockCalendars;
      } else {
        const fullName = `${profile.first_name} ${profile.last_name}`;

        if (fullName === 'Ornella Attard') {
          calendarsToShow = mockCalendars;
        } else if (fullName === 'Benjamin Zaoui') {
          calendarsToShow = mockCalendars.filter(cal =>
            cal.name === 'Benjamin Zaoui' || cal.name === 'Ornella Attard'
          );
        } else {
          const userCalendar = mockCalendars.find(cal => cal.name === fullName);
          calendarsToShow = userCalendar ? [userCalendar] : mockCalendars;
        }
      }

      setAvailableCalendars(calendarsToShow);
      setVisibleCalendars(calendarsToShow.map(c => c.id));
    } catch (err) {
      console.error('Error loading profile:', err);
      setAvailableCalendars(mockCalendars);
      setVisibleCalendars(mockCalendars.map(c => c.id));
    }
  };

  const getAppointmentsForDay = (date: Date) => {
    return appointments.filter(apt => {
      const aptDate = apt.date instanceof Date ? apt.date : new Date(apt.date);
      return aptDate.getDate() === date.getDate() &&
             aptDate.getMonth() === date.getMonth() &&
             aptDate.getFullYear() === date.getFullYear() &&
             visibleCalendars.includes(apt.projectId);
    });
  };

  const getWeekDates = () => {
    const weekStart = new Date(currentDate);
    const dayOfWeek = weekStart.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    weekStart.setDate(weekStart.getDate() + diff);

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      return date;
    });
  };

  const toggleCalendarVisibility = (calendarId: string) => {
    setVisibleCalendars(prev =>
      prev.includes(calendarId)
        ? prev.filter(id => id !== calendarId)
        : [...prev, calendarId]
    );
  };

  const checkTimeConflict = (newApt: any, newDate: Date, newTime: string) => {
    const newStartMinutes = parseTimeToMinutes(newTime);
    const newEndMinutes = newStartMinutes + newApt.duration;

    return appointments.find(apt => {
      if (apt.id === newApt.id) return false;

      const aptDate = apt.date instanceof Date ? apt.date : new Date(apt.date);
      if (aptDate.getDate() !== newDate.getDate() ||
          aptDate.getMonth() !== newDate.getMonth() ||
          aptDate.getFullYear() !== newDate.getFullYear()) {
        return false;
      }

      const aptStartMinutes = parseTimeToMinutes(apt.time);
      const aptEndMinutes = aptStartMinutes + apt.duration;

      return (newStartMinutes >= aptStartMinutes && newStartMinutes < aptEndMinutes) ||
             (newEndMinutes > aptStartMinutes && newEndMinutes <= aptEndMinutes) ||
             (newStartMinutes <= aptStartMinutes && newEndMinutes >= aptEndMinutes);
    });
  };

  const handleDragStart = (apt: any) => {
    setDraggedAppointment(apt);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetDate: Date) => {
    if (!draggedAppointment) return;

    const conflict = checkTimeConflict(draggedAppointment, targetDate, draggedAppointment.time);

    if (conflict) {
      setConflictInfo({
        newAppointment: draggedAppointment,
        conflictingAppointment: conflict,
        newDate: targetDate
      });
      setShowConflictModal(true);
    } else {
      setAppointments(prev => prev.map(apt =>
        apt.id === draggedAppointment.id
          ? { ...apt, date: targetDate }
          : apt
      ));
    }

    setDraggedAppointment(null);
  };

  const handleConflictConfirm = () => {
    if (!conflictInfo) return;

    setAppointments(prev => prev.map(apt =>
      apt.id === conflictInfo.newAppointment.id
        ? { ...apt, date: conflictInfo.newDate }
        : apt
    ));

    setShowConflictModal(false);
    setConflictInfo(null);
  };

  const handleConflictDelay = () => {
    if (!conflictInfo) return;

    const conflictEndMinutes = parseTimeToMinutes(conflictInfo.conflictingAppointment.time) +
                               conflictInfo.conflictingAppointment.duration + 10;
    const newHour = Math.floor(conflictEndMinutes / 60);
    const newMinute = conflictEndMinutes % 60;
    const newTime = `${String(newHour).padStart(2, '0')}:${String(newMinute).padStart(2, '0')}`;

    setAppointments(prev => prev.map(apt =>
      apt.id === conflictInfo.newAppointment.id
        ? { ...apt, date: conflictInfo.newDate, time: newTime }
        : apt
    ));

    setShowConflictModal(false);
    setConflictInfo(null);
  };

  const handleDoubleClick = (date: Date, hour?: number) => {
    setNewAppointmentTime({ date, hour: hour || 9 });
    setShowAppointmentModal(true);
  };

  const handleAppointmentClick = (apt: any) => {
    const mockLead = {
      id: apt.id,
      first_name: apt.leadName.split(' ')[0],
      last_name: apt.leadName.split(' ').slice(1).join(' '),
      email: `${apt.leadName.toLowerCase().replace(' ', '.')}@example.com`,
      phone: '0612345678',
      birth_year: 1980,
      city: 'Paris',
      postal_code: '75001',
      residence_status: 'Propriétaire',
      profession: '',
      notes: 'PERCEVAIT LOYERS\nVENDU PROPRIETE\nACHETE 2 E MAISON\nAVANT TAXE FONCIERE\n\nIMPOTS : 1800\n\nSERA A LA MAISON AVEC AVIS D IMPOTS'
    };

    const calendar = mockCalendars.find(c => c.id === apt.projectId);

    setSelectedAppointment({
      id: apt.id,
      title: apt.title,
      date: currentDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }),
      time: apt.time,
      duration: '1h',
      location: 'Bureau',
      reminder: true,
      notes: 'Rendez-vous important',
      lead: mockLead,
      collaborators: apt.collaborators || [],
      calendarName: calendar?.name,
      calendarColor: calendar?.color
    });
    setShowEnhancedModal(true);
  };


  const handleEditAppointment = (appointment: any) => {
    setEditingAppointment(appointment);
    setShowEnhancedModal(false);
    setSelectedAppointment(null);
    setShowAppointmentModal(true);
  };

  const handleDeleteAppointment = (appointmentId: string) => {
    console.log(`Suppression du rendez-vous ${appointmentId}`);
  };

  const handleDropWithTime = (hour: number, minute: number = 0, date?: Date) => {
    if (draggedAppointment) {
      const newTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

      setAppointments(prevAppointments =>
        prevAppointments.map(apt =>
          apt.id === draggedAppointment.id
            ? { ...apt, time: newTime, ...(date && { date }) }
            : apt
        )
      );

      setDraggedAppointment(null);
    }
  };

  const handleDurationChange = (appointmentId: string, newDuration: number, newTime: string) => {
    setAppointments(prevAppointments =>
      prevAppointments.map(apt =>
        apt.id === appointmentId
          ? { ...apt, duration: newDuration, time: newTime }
          : apt
      )
    );
  };

  useEffect(() => {
    const isModalOpen = showAppointmentModal || selectedAppointment;
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showAppointmentModal, selectedAppointment]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showAppointmentModal) {
          setShowAppointmentModal(false);
          setEditingAppointment(null);
        }
        if (selectedAppointment) {
          setSelectedAppointment(null);
          setShowEnhancedModal(false);
        }
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showAppointmentModal, selectedAppointment]);

  const navigatePrevious = () => {
    const newDate = new Date(currentDate);
    if (view === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else if (view === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const navigateNext = () => {
    const newDate = new Date(currentDate);
    if (view === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const getDateRangeLabel = () => {
    if (view === 'day') {
      return currentDate.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } else if (view === 'week') {
      const weekStart = new Date(currentDate);
      const dayOfWeek = weekStart.getDay();
      const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      weekStart.setDate(weekStart.getDate() + diff);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      return `${weekStart.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} - ${weekEnd.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    } else {
      return currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    }
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    while (days.length < 35) {
      days.push(null);
    }

    return days.slice(0, 35);
  };

  const days = getDaysInMonth();

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className="glass-card ml-20 mr-4 lg:mx-8 mt-4 md:mt-6 lg:mt-8 px-4 md:px-6 lg:px-8 py-4 md:py-5 flex items-center justify-between floating-shadow flex-shrink-0">
        <div>
          <h1 className="text-xl md:text-2xl font-light text-gray-900">Calendrier</h1>
          <p className="text-xs md:text-sm text-gray-500 font-light mt-1 hidden sm:block">Planifiez et organisez vos rendez-vous</p>
        </div>
        <button onClick={onNotificationClick} className="w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-all hover:scale-105 shadow-sm relative flex-shrink-0">
          <Bell className="w-5 h-5 text-gray-600" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-xs font-light shadow-lg animate-pulse">
              {notificationCount}
            </span>
          )}
        </button>
      </header>

      <div className="px-4 md:px-6 lg:px-8 py-2 md:py-3 lg:py-4 flex-1 flex flex-col overflow-hidden relative">
        <div className="glass-card p-2 md:p-3 lg:p-4 floating-shadow flex-1 flex flex-col overflow-hidden relative">
          {(showAppointmentModal || selectedAppointment) && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-md z-10 rounded-xl transition-opacity duration-150"></div>
          )}
          <div className="flex items-center justify-between gap-3 mb-1.5 flex-shrink-0 flex-wrap">
            <div className="flex items-center gap-2 flex-1 min-w-0 relative">
              <span className="text-sm font-light text-gray-700 whitespace-nowrap flex-shrink-0">Calendriers :</span>
              <div className="relative">
                <button
                  onClick={() => setShowCalendarDropdown(!showCalendarDropdown)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-light hover:bg-gray-50 transition-all shadow-sm"
                >
                  <span className="text-gray-700">{visibleCalendars.length} sélectionné{visibleCalendars.length > 1 ? 's' : ''}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${showCalendarDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showCalendarDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowCalendarDropdown(false)}
                    />
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-200 p-3 z-20">
                      {availableCalendars.map((calendar) => (
                        <label
                          key={calendar.id}
                          className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={visibleCalendars.includes(calendar.id)}
                            onChange={() => toggleCalendarVisibility(calendar.id)}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-400/50"
                          />
                          <div className={`w-3 h-3 rounded-full ${getColorClasses(calendar.color)}`} />
                          <span className="text-sm font-light text-gray-900 flex-1">{calendar.name}</span>
                          {visibleCalendars.includes(calendar.id) ? (
                            <Eye className="w-4 h-4 text-gray-600" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                          )}
                        </label>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={navigatePrevious} className="w-11 h-11 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-all hover:scale-105 shadow-sm flex-shrink-0">
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h2 className="text-lg font-light text-gray-900 capitalize whitespace-nowrap">{getDateRangeLabel()}</h2>
              <button onClick={navigateNext} className="w-11 h-11 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-all hover:scale-105 shadow-sm flex-shrink-0">
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="flex gap-2 items-center flex-shrink-0">
              <div className="flex gap-1 bg-white border border-gray-200 rounded-full p-1">
                <button
                  onClick={() => setView('day')}
                  className={`px-4 py-2.5 text-sm font-light rounded-full transition-all ${
                    view === 'day' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm' : 'text-gray-700 hover:bg-white'
                  }`}
                >
                  Jour
                </button>
                <button
                  onClick={() => setView('week')}
                  className={`px-4 py-2.5 text-sm font-light rounded-full transition-all ${
                    view === 'week' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm' : 'text-gray-700 hover:bg-white'
                  }`}
                >
                  Semaine
                </button>
                <button
                  onClick={() => setView('month')}
                  className={`px-4 py-2.5 text-sm font-light rounded-full transition-all ${
                    view === 'month' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm' : 'text-gray-700 hover:bg-white'
                  }`}
                >
                  Mois
                </button>
              </div>
              <button onClick={() => setShowAppointmentModal(true)} className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-light hover:from-blue-600 hover:to-blue-700 flex items-center gap-2 shadow-md transition-all hover:scale-105">
                <Plus className="w-5 h-5" />
                <span className="whitespace-nowrap">Ajouter RDV</span>
              </button>
            </div>
          </div>

          {view === 'day' && (
            <div className="space-y-0">
              <div className="grid grid-cols-1">
                {Array.from({ length: 24 }).map((_, hour) => {
                  const dayAppointments = appointments.filter(apt => {
                    const aptDate = apt.date instanceof Date ? apt.date : new Date(apt.date);
                    return aptDate.getDate() === currentDate.getDate() &&
                           aptDate.getMonth() === currentDate.getMonth() &&
                           aptDate.getFullYear() === currentDate.getFullYear() &&
                           visibleCalendars.includes(apt.projectId);
                  });

                  const appointmentsWithPosition: AppointmentWithPosition[] = dayAppointments.map(apt => ({
                    ...apt,
                    startMinutes: parseTimeToMinutes(apt.time),
                    endMinutes: parseTimeToMinutes(apt.time) + apt.duration
                  }));

                  const hourStart = hour * 60;
                  const hourEnd = hourStart + 60;
                  const hourAppointments = appointmentsWithPosition.filter(apt =>
                    apt.startMinutes < hourEnd && apt.endMinutes > hourStart
                  );

                  const positionedAppointments = calculateAppointmentColumns(hourAppointments);

                  return (
                    <div key={hour} className="flex gap-3 border-b border-gray-200/50">
                      <div className="w-16 flex items-start pt-1">
                        <div className="text-xs font-light text-gray-500">{hour.toString().padStart(2, '0')}:00</div>
                      </div>
                      <div
                        className="flex-1 min-h-[48px] cursor-pointer relative"
                        onDoubleClick={() => handleDoubleClick(currentDate, hour)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const y = e.clientY - rect.top;
                          const quarterHeight = rect.height / 4;
                          const minute = Math.floor(y / quarterHeight) * 15;
                          handleDropWithTime(hour, minute);
                        }}
                      >
                        {positionedAppointments
                          .filter(apt => Math.floor(apt.startMinutes / 60) === hour)
                          .map(apt => {
                            const calendar = mockCalendars.find(c => c.id === apt.projectId);

                            return (
                              <ResizableAppointment
                                key={apt.id}
                                appointment={apt}
                                color={calendar?.color || 'blue'}
                                onAppointmentClick={() => handleAppointmentClick(apt)}
                                onDurationChange={(newDuration, newTime) => handleDurationChange(apt.id, newDuration, newTime)}
                                onDragStart={() => handleDragStart(apt)}
                                containerHeight={48}
                              />
                            );
                          })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {view === 'week' && (
            <div className="hidden md:flex flex-col overflow-auto" style={{ maxHeight: 'calc(100vh - 280px)' }}>
              <div className="flex sticky top-0 bg-white z-10">
                <div className="w-16 flex-shrink-0 border-b border-gray-200"></div>
                {daysOfWeek.map((day, dayIndex) => {
                  const weekDates = getWeekDates();
                  const dayDate = weekDates[dayIndex];
                  const isToday = dayDate.getDate() === new Date().getDate() &&
                                  dayDate.getMonth() === new Date().getMonth() &&
                                  dayDate.getFullYear() === new Date().getFullYear();

                  return (
                    <div key={day} className="flex-1 px-2 py-3 text-center border-b border-r border-gray-200">
                      <span className="text-xs font-light text-gray-600">{day}</span>
                      <div className={`text-lg font-light mt-1 ${isToday ? 'text-blue-600 font-normal' : 'text-gray-900'}`}>
                        {dayDate.getDate()}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex-1">
                {Array.from({ length: 24 }).map((_, hour) => {
                  const weekDates = getWeekDates();

                  return (
                    <div key={hour} className="flex border-b border-gray-200/50">
                      <div className="w-16 flex-shrink-0 flex items-start pt-1">
                        <div className="text-xs font-light text-gray-500">{hour.toString().padStart(2, '0')}:00</div>
                      </div>

                      {weekDates.map((dayDate, dayIndex) => {
                        const dayAppointments = appointments.filter(apt => {
                          const aptDate = apt.date instanceof Date ? apt.date : new Date(apt.date);
                          return aptDate.getDate() === dayDate.getDate() &&
                                 aptDate.getMonth() === dayDate.getMonth() &&
                                 aptDate.getFullYear() === dayDate.getFullYear() &&
                                 visibleCalendars.includes(apt.projectId);
                        });

                        const appointmentsWithPosition: AppointmentWithPosition[] = dayAppointments.map(apt => ({
                          ...apt,
                          startMinutes: parseTimeToMinutes(apt.time),
                          endMinutes: parseTimeToMinutes(apt.time) + apt.duration
                        }));

                        const hourStart = hour * 60;
                        const hourEnd = hourStart + 60;
                        const hourAppointments = appointmentsWithPosition.filter(apt =>
                          apt.startMinutes < hourEnd && apt.endMinutes > hourStart
                        );

                        const positionedAppointments = calculateAppointmentColumns(hourAppointments);

                        return (
                          <div
                            key={dayIndex}
                            className="flex-1 min-h-[48px] border-r border-gray-200 relative cursor-pointer hover:bg-gray-50/50 transition-colors"
                            onDoubleClick={() => handleDoubleClick(dayDate, hour)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              const y = e.clientY - rect.top;
                              const quarterHeight = rect.height / 4;
                              const minute = Math.floor(y / quarterHeight) * 15;
                              handleDropWithTime(hour, minute, dayDate);
                            }}
                          >
                            {positionedAppointments
                              .filter(apt => Math.floor(apt.startMinutes / 60) === hour)
                              .map(apt => {
                                const calendar = mockCalendars.find(c => c.id === apt.projectId);

                                return (
                                  <ResizableAppointment
                                    key={apt.id}
                                    appointment={apt}
                                    color={calendar?.color || 'blue'}
                                    onAppointmentClick={() => handleAppointmentClick(apt)}
                                    onDurationChange={(newDuration, newTime) => handleDurationChange(apt.id, newDuration, newTime)}
                                    onDragStart={() => handleDragStart(apt)}
                                    containerHeight={48}
                                  />
                                );
                              })}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {view === 'month' && (
            <div className="hidden md:flex flex-col overflow-hidden rounded-xl shadow-lg border border-gray-200 flex-1">
              <div className="grid grid-cols-7 gap-0 flex-shrink-0">
                {daysOfWeek.map((day) => (
                  <div key={day} className="px-1.5 py-2 text-center bg-gray-50 border-r border-b border-gray-200 last:border-r-0">
                    <span className="text-xs font-medium text-gray-600 uppercase">{day}.</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 grid-rows-5 gap-0" style={{ height: '750px' }}>
                {days.map((day, index) => {
                  const dayDate = day ? new Date(currentDate.getFullYear(), currentDate.getMonth(), day) : null;
                  const appointments = dayDate ? getAppointmentsForDay(dayDate) : [];
                  const dayOfWeek = dayDate?.getDay();
                  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

                  return (
                    <div
                      key={index}
                      className={`border-r border-b border-gray-200 bg-white overflow-hidden last:border-r-0 flex flex-col cursor-pointer hover:bg-blue-50/30 transition-colors ${
                        day === null ? 'opacity-30 bg-gray-50' : ''
                      } ${day === currentDate.getDate() ? 'bg-blue-50/50' : ''} ${
                        isWeekend ? 'bg-gray-50/50' : ''
                      }`}
                      onDoubleClick={() => {
                        if (day) {
                          const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                          handleDoubleClick(selectedDate);
                        }
                      }}
                      onDragOver={handleDragOver}
                      onDrop={() => {
                        if (day) {
                          const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                          handleDrop(targetDate);
                        }
                      }}
                    >
                      {day && (
                        <div className="h-full flex flex-col min-h-0 p-1.5">
                          <div className="mb-0.5 flex-shrink-0 text-center">
                            <span className={`text-xs font-medium ${
                              day === currentDate.getDate() ? 'text-blue-600' : 'text-gray-700'
                            }`}>
                              {day}
                            </span>
                          </div>
                          <div className="space-y-0.5 flex-1 overflow-hidden min-h-0">
                            {appointments.slice(0, 8).map(apt => {
                              const calendar = mockCalendars.find(c => c.id === apt.projectId);
                              const dotColor = calendar?.color === 'blue' ? 'bg-blue-500' :
                                             calendar?.color === 'green' ? 'bg-green-500' :
                                             'bg-orange-500';
                              return (
                                <div
                                  key={apt.id}
                                  draggable
                                  onDragStart={(e) => {
                                    e.stopPropagation();
                                    handleDragStart(apt);
                                  }}
                                  className="flex items-center gap-1 cursor-move hover:bg-gray-100 px-1 py-0.5 rounded text-xs transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAppointmentClick(apt);
                                  }}
                                >
                                  <div className={`w-2 h-2 rounded-full ${dotColor} flex-shrink-0`}></div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-xs text-gray-700 truncate leading-tight">
                                      {apt.time} {apt.title}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                            {appointments.length > 8 && (
                              <div className="text-xs text-gray-500 px-1 flex-shrink-0">
                                +{appointments.length - 8} autres
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="md:hidden space-y-3">
            {days.filter(day => day !== null).map((day, index) => {
              const dayDate = day ? new Date(currentDate.getFullYear(), currentDate.getMonth(), day) : null;
              const appointments = dayDate ? getAppointmentsForDay(dayDate) : [];
              return (
                <div key={index} className={`glass-card p-4 transition-all hover:bg-white/80 cursor-pointer ${
                  day === currentDate.getDate() ? 'bg-gradient-to-br from-blue-50 to-violet-50 border-blue-200' : ''
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-sm font-light ${
                      day === currentDate.getDate() ? 'text-blue-600 font-normal' : 'text-gray-900'
                    }`}>
                      {daysOfWeek[(new Date(currentDate.getFullYear(), currentDate.getMonth(), day).getDay() + 6) % 7]} {day}
                    </span>
                    {day === currentDate.getDate() && (
                      <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full font-light">Aujourd'hui</span>
                    )}
                  </div>
                  {appointments.length > 0 ? (
                    <div className="space-y-2">
                      {appointments.map(apt => {
                        const calendar = mockCalendars.find(c => c.id === apt.projectId);
                        return (
                          <div
                            key={apt.id}
                            className={`${getColorClasses(calendar?.color || 'blue')} text-white px-3 py-2 rounded-xl cursor-pointer hover:opacity-90 transition-opacity`}
                            onClick={() => setSelectedAppointment({
                              id: apt.id,
                              title: apt.title,
                              client_name: apt.leadName,
                              date: new Date().toLocaleDateString('fr-FR'),
                              time: apt.time,
                              duration: '1h',
                              location: 'Bureau',
                              reminder: true,
                              notes: 'Rendez-vous important'
                            })}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-normal">{apt.time}</span>
                              <span className="text-xs font-light">{apt.leadName}</span>
                            </div>
                            <div className="text-xs font-light mt-1 opacity-90">{apt.title}</div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 font-light">Aucun rendez-vous</p>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {showAppointmentModal && (
        <AddAppointmentModal
          onClose={() => {
            setShowAppointmentModal(false);
            setEditingAppointment(null);
          }}
          appointment={editingAppointment}
        />
      )}

      {selectedAppointment && !showEnhancedModal && (
        <AppointmentDetailsModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onEdit={(apt) => {
            setEditingAppointment(apt);
            setSelectedAppointment(null);
            setShowAppointmentModal(true);
          }}
          onDelete={(id) => {
            setSelectedAppointment(null);
          }}
        />
      )}

      {selectedAppointment && showEnhancedModal && (
        <AppointmentDetailsWithLeadModal
          appointment={selectedAppointment}
          onClose={() => {
            setSelectedAppointment(null);
            setShowEnhancedModal(false);
          }}
          onEdit={handleEditAppointment}
          onDelete={handleDeleteAppointment}
        />
      )}

      {showConflictModal && conflictInfo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 max-w-md w-full floating-shadow animate-scale-in">
            <h3 className="text-xl font-light text-gray-900 mb-4">Conflit de rendez-vous</h3>
            <p className="text-sm text-gray-600 font-light mb-6">
              Un rendez-vous existe déjà sur ce créneau horaire :
            </p>
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
              <div className="text-sm font-light text-gray-900 mb-1">
                {conflictInfo.conflictingAppointment.title}
              </div>
              <div className="text-xs text-gray-600 font-light">
                {conflictInfo.conflictingAppointment.time} - Durée : {conflictInfo.conflictingAppointment.duration} min
              </div>
            </div>
            <p className="text-sm text-gray-600 font-light mb-6">
              Que souhaitez-vous faire ?
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleConflictConfirm}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-light hover:from-blue-600 hover:to-blue-700 transition-all"
              >
                Confirmer quand même
              </button>
              <button
                onClick={handleConflictDelay}
                className="flex-1 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-light hover:bg-gray-50 transition-all"
              >
                Décaler de 10 min
              </button>
              <button
                onClick={() => {
                  setShowConflictModal(false);
                  setConflictInfo(null);
                  setDraggedAppointment(null);
                }}
                className="flex-1 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-light hover:bg-gray-50 transition-all"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
