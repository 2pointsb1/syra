import { X, Clock, MapPin, Bell, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Lead } from '../types';
import { supabase } from '../lib/supabase';

interface AddAppointmentFromLeadModalProps {
  onClose: () => void;
  lead: Lead;
}

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  profile_type: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

export default function AddAppointmentFromLeadModal({ onClose, lead }: AddAppointmentFromLeadModalProps) {
  const [title, setTitle] = useState(`RDV ${lead.first_name} ${lead.last_name}`);
  const [notes, setNotes] = useState('');
  const [location, setLocation] = useState('');
  const [appointmentType, setAppointmentType] = useState('consultation');
  const [enableReminder, setEnableReminder] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [signataires, setSignataires] = useState<UserProfile[]>([]);
  const [selectedSignataire, setSelectedSignataire] = useState<string>('');
  const [signataireSearchQuery, setSignataireSearchQuery] = useState<string>('');
  const [showSignataireDropdown, setShowSignataireDropdown] = useState<boolean>(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [occupiedSlots, setOccupiedSlots] = useState<{[key: string]: string[]}>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSignataires();
  }, []);

  useEffect(() => {
    if (selectedSignataire && selectedDate) {
      loadOccupiedSlots();
    }
  }, [selectedSignataire, selectedDate]);

  const loadSignataires = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, first_name, last_name, email, profile_type')
        .eq('profile_type', 'Signataire');

      if (error) throw error;
      setSignataires(data || []);
    } catch (error) {
      console.error('Error loading signataires:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadOccupiedSlots = async () => {
    if (!selectedSignataire || !selectedDate) return;

    const dateString = selectedDate.toISOString().split('T')[0];

    try {
      const { data, error } = await supabase
        .from('signataire_disponibilites')
        .select('start_time, end_time')
        .eq('signataire_id', selectedSignataire)
        .eq('appointment_date', dateString);

      if (error) throw error;

      const occupied: string[] = [];
      (data || []).forEach((slot: any) => {
        occupied.push(slot.start_time.substring(0, 5));
      });

      setOccupiedSlots({ ...occupiedSlots, [dateString]: occupied });
    } catch (error) {
      console.error('Error loading occupied slots:', error);
    }
  };

  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const dateString = selectedDate?.toISOString().split('T')[0] || '';
    const occupied = occupiedSlots[dateString] || [];

    for (let hour = 7; hour <= 21; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push({
          time: timeString,
          available: !occupied.includes(timeString)
        });
      }
    }

    const lastSlot = '22:00';
    slots.push({
      time: lastSlot,
      available: !occupied.includes(lastSlot)
    });

    return slots;
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedTimeSlot('');
  };

  const handleTimeSlotClick = (time: string) => {
    setSelectedTimeSlot(time);
  };

  const calculateEndTime = (startTime: string): string => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const endHour = hours + 1;
    return `${endHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSignataire || !selectedDate || !selectedTimeSlot) {
      alert('Veuillez sélectionner un signataire, une date et un créneau horaire.');
      return;
    }

    const dateString = selectedDate.toISOString().split('T')[0];
    const endTime = calculateEndTime(selectedTimeSlot);

    try {
      const { error: availabilityError } = await supabase
        .from('signataire_disponibilites')
        .insert({
          signataire_id: selectedSignataire,
          appointment_date: dateString,
          start_time: selectedTimeSlot,
          end_time: endTime,
          status: 'occupied'
        });

      if (availabilityError) throw availabilityError;

      setShowConfirmation(true);
      setTimeout(() => {
        onClose();
      }, 2500);
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('Erreur lors de la création du rendez-vous');
    }
  };

  const days = getDaysInMonth(currentMonth);
  const timeSlots = selectedDate ? generateTimeSlots() : [];
  const monthName = currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  return createPortal(
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[109]" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-[110] p-8">
        <div className="bg-white dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-y-auto pointer-events-auto" onClick={(e) => e.stopPropagation()}>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700/30 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-900/95 backdrop-blur-xl rounded-t-3xl">
            <h2 className="text-2xl font-light text-gray-900 dark:text-gray-100">Ajouter un rendez-vous</h2>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-all">
              <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">Titre du rendez-vous</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                placeholder="Consultation, Présentation..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">Lead / Prospect</label>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-light shadow-md">
                    {lead.first_name.charAt(0)}{lead.last_name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-light text-gray-900 dark:text-gray-100">{lead.first_name} {lead.last_name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-light">{lead.email}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-light">{lead.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">Signataire</label>
              {loading ? (
                <p className="text-sm text-gray-500">Chargement des signataires...</p>
              ) : (
                <div className="relative">
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 dark:text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      value={signataireSearchQuery}
                      onChange={(e) => {
                        setSignataireSearchQuery(e.target.value);
                        setShowSignataireDropdown(true);
                      }}
                      onFocus={() => setShowSignataireDropdown(true)}
                      placeholder="Rechercher un signataire..."
                      className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                      required={!selectedSignataire}
                    />
                  </div>

                  {showSignataireDropdown && signataireSearchQuery && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 max-h-64 overflow-y-auto z-20">
                      {signataires
                        .filter(sig => {
                          const fullName = `${sig.first_name} ${sig.last_name}`.toLowerCase();
                          const query = signataireSearchQuery.toLowerCase();
                          return fullName.includes(query) || sig.email.toLowerCase().includes(query);
                        })
                        .map((sig) => (
                          <button
                            key={sig.id}
                            type="button"
                            onClick={() => {
                              setSelectedSignataire(sig.id);
                              setSignataireSearchQuery(`${sig.first_name} ${sig.last_name}`);
                              setShowSignataireDropdown(false);
                              setSelectedDate(null);
                              setSelectedTimeSlot('');
                            }}
                            className="w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex flex-col gap-1 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                          >
                            <span className="text-sm font-light text-gray-900 dark:text-gray-100">{sig.first_name} {sig.last_name}</span>
                            <span className="text-xs text-gray-600 dark:text-gray-400 font-light">{sig.email}</span>
                          </button>
                        ))}
                      {signataires.filter(sig => {
                        const fullName = `${sig.first_name} ${sig.last_name}`.toLowerCase();
                        const query = signataireSearchQuery.toLowerCase();
                        return fullName.includes(query) || sig.email.toLowerCase().includes(query);
                      }).length === 0 && (
                        <p className="p-3 text-sm text-gray-500 dark:text-gray-400 text-center">Aucun signataire trouvé</p>
                      )}
                    </div>
                  )}

                  {selectedSignataire && !showSignataireDropdown && (
                    <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 flex items-center justify-between">
                      <span className="text-sm font-light text-gray-900 dark:text-gray-100">
                        {(() => {
                          const sig = signataires.find(s => s.id === selectedSignataire);
                          return sig ? `${sig.first_name} ${sig.last_name}` : '';
                        })()}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSignataire('');
                          setSignataireSearchQuery('');
                          setSelectedDate(null);
                          setSelectedTimeSlot('');
                        }}
                        className="w-6 h-6 rounded-full hover:bg-blue-100 dark:hover:bg-blue-800 flex items-center justify-center transition-all"
                      >
                        <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {selectedSignataire && (
              <>
                <div>
                  <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-3">Sélectionner une date et un créneau</label>
                  <div className="flex gap-4">
                    {/* Calendrier - 60% */}
                    <div className="flex-[6] bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl p-3">
                      <div className="flex items-center justify-between mb-3">
                        <button
                          type="button"
                          onClick={previousMonth}
                          className="w-7 h-7 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-all"
                        >
                          <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                        <h3 className="text-xs font-light text-gray-900 dark:text-gray-100 capitalize">{monthName}</h3>
                        <button
                          type="button"
                          onClick={nextMonth}
                          className="w-7 h-7 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-all"
                        >
                          <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                      </div>

                      <div className="grid grid-cols-7 gap-1 mb-1">
                        {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((day) => (
                          <div key={day} className="text-center text-[10px] font-light text-gray-500 dark:text-gray-400">
                            {day}
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-7 gap-1">
                        {days.map((day, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => day && handleDateClick(day)}
                            disabled={!day}
                            className={`aspect-square rounded-lg text-[11px] font-light transition-all ${
                              !day
                                ? 'invisible'
                                : selectedDate?.toDateString() === day.toDateString()
                                ? 'bg-blue-500 text-white'
                                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100'
                            }`}
                          >
                            {day?.getDate()}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Créneaux disponibles - 40% */}
                    <div className="flex-[4] bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl p-3 flex flex-col min-h-0">
                      {selectedDate ? (
                        <>
                          <h4 className="text-xs font-light text-gray-900 dark:text-gray-100 mb-2 flex-shrink-0">
                            Créneaux - {selectedDate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                          </h4>
                          <div className="flex-1 overflow-y-auto space-y-1 pr-1 min-h-0">
                            {timeSlots.map((slot) => (
                              <button
                                key={slot.time}
                                type="button"
                                onClick={() => slot.available && handleTimeSlotClick(slot.time)}
                                disabled={!slot.available}
                                className={`w-full px-3 py-1.5 rounded-lg text-xs font-light transition-all flex-shrink-0 ${
                                  !slot.available
                                    ? 'bg-gray-100 dark:bg-gray-700/50 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                    : selectedTimeSlot === slot.time
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-900 dark:text-gray-100'
                                }`}
                              >
                                {slot.time}
                              </button>
                            ))}
                          </div>
                          {selectedTimeSlot && (
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-light mt-2 flex-shrink-0">
                              Durée: 1h ({selectedTimeSlot} - {calculateEndTime(selectedTimeSlot)})
                            </p>
                          )}
                        </>
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-light text-center">
                            Sélectionnez une date
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">Type de RDV</label>
              <select
                value={appointmentType}
                onChange={(e) => {
                  setAppointmentType(e.target.value);
                  setEnableReminder(e.target.value === 'rdv-physique' || e.target.value === 'visio');
                }}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
              >
                <option value="consultation">Consultation</option>
                <option value="rdv-physique">RDV Physique (rappel 30min)</option>
                <option value="visio">Visio (rappel 30min)</option>
                <option value="appel">Appel téléphonique</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-400" />
                Lieu (optionnel)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light"
                placeholder="Adresse ou lien de visio..."
              />
            </div>

            {enableReminder && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 flex items-start gap-3">
                <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-light text-gray-900 dark:text-gray-100">Rappel activé</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-light mt-1">
                    Une notification sera envoyée 30 minutes avant le rendez-vous
                  </p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-light text-gray-700 dark:text-gray-300 mb-2">Notes (optionnel)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-light resize-none"
                placeholder="Informations complémentaires..."
              />
            </div>

            {showConfirmation && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-4 animate-scale-in">
                <p className="text-sm text-green-800 dark:text-green-300 font-light text-center">
                  Un e-mail de confirmation sera envoyé au lead pour l'informer de ce rendez-vous.
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-2.5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 rounded-full text-sm text-gray-900 dark:text-gray-100 font-light hover:bg-white dark:hover:bg-gray-800 transition-all"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm text-gray-900 dark:text-gray-100 font-light hover:from-blue-600 hover:to-blue-700 shadow-md transition-all hover:scale-105"
              >
                Créer le rendez-vous
              </button>
            </div>
          </form>
        </div>
      </div>
    </>,
    document.body
  );
}
