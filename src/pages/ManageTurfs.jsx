import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, MapPin, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useVenue } from '../context/VenueContext';
import api from '../api';

export default function ManageTurfs() {
    const { user } = useAuth();
    const { venues, refreshVenues, loadingVenues } = useVenue();
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        location: '',
        address: '',
        description: '',
        contactName: '',
        contactNumber: '',
        sports: [{ type: '', price: 0 }]
    });

    useEffect(() => {
        // Fetch happens in context, but we can call refresh to ensure it's up to date when mounting
        refreshVenues();
    }, []);

    const handleOpenCreate = () => {
        setEditingId(null);
        setFormData({
            name: '',
            location: '',
            address: '',
            description: '',
            contactName: '',
            contactNumber: '',
            sports: [{ type: '', price: 0 }]
        });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (venue) => {
        setEditingId(venue.id);
        setFormData({
            name: venue.name || '',
            location: venue.location || '',
            address: venue.address || '',
            description: venue.description || '',
            contactName: venue.contactName || '',
            contactNumber: venue.contactNumber || '',
            sports: venue.sports && venue.sports.length > 0 ? venue.sports : [{ type: '', price: 0 }]
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this venue? This action cannot be undone.")) return;
        try {
            await api.delete(`/venues/${id}`);
            refreshVenues();
            alert("Venue deleted successfully.");
        } catch (err) {
            console.error("Failed to delete venue", err);
            alert("Failed to delete venue.");
        }
    };

    const handleAddSport = () => {
        setFormData(prev => ({
            ...prev,
            sports: [...prev.sports, { type: '', price: 0 }]
        }));
    };

    const handleRemoveSport = (index) => {
        setFormData(prev => ({
            ...prev,
            sports: prev.sports.filter((_, i) => i !== index)
        }));
    };

    const handleSportChange = (index, field, value) => {
        const newSports = [...formData.sports];
        newSports[index][field] = field === 'price' ? Number(value) : value;
        setFormData({ ...formData, sports: newSports });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoadingSubmit(true);
        try {
            if (editingId) {
                await api.put(`/venues/${editingId}`, formData);
                alert("Venue updated successfully!");
            } else {
                await api.post('/venues', formData);
                alert("Venue created successfully!");
            }
            setIsModalOpen(false);
            refreshVenues();
        } catch (err) {
            console.error("Failed to save venue", err);
            alert("Failed to save venue.");
        } finally {
            setLoadingSubmit(false);
        }
    };

    if (!user || user.role !== 'owner') {
        return (
            <div className="section container" style={{ paddingTop: '8rem', textAlign: 'center' }}>
                <h2>Access Denied</h2>
                <p>You must be an Owner/Admin to view this page.</p>
            </div>
        );
    }

    return (
        <div className="section container" style={{ paddingTop: '8rem', minHeight: '100vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Manage Turfs</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Add, edit, or remove turfs and courts dynamically.</p>
                </div>
                <button className="btn btn-primary" onClick={handleOpenCreate} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={20} /> Add New Turf
                </button>
            </div>

            {loadingVenues ? (
                <p>Loading turfs from database...</p>
            ) : venues.length === 0 ? (
                <div style={{ padding: '3rem', background: 'white', borderRadius: 'var(--radius-lg)', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>No turfs found in the database.</p>
                    <button className="btn btn-outline" onClick={handleOpenCreate}>Create Your First Turf</button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    {venues.map(venue => (
                        <div key={venue.id} style={{ background: 'white', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-color)' }}>
                            {/* Card Content */}
                            <div style={{ padding: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{venue.name}</h3>
                                <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                    <MapPin size={16} /> {venue.location}
                                </p>
                                
                                <div style={{ marginBottom: '1rem' }}>
                                    <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Courts/Sports:</h4>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        {venue.sports && venue.sports.map((sport, i) => (
                                            <span key={i} style={{ background: 'var(--bg-secondary)', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: 600 }}>
                                                {sport.type} (₹{sport.price}/hr)
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                                    <button 
                                        onClick={() => handleOpenEdit(venue)}
                                        style={{ flex: 1, padding: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', background: '#fef08a', color: '#854d0e', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 600 }}
                                    >
                                        <Edit2 size={16} /> Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(venue.id)}
                                        style={{ flex: 1, padding: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', background: '#fee2e2', color: '#b91c1c', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 600 }}
                                    >
                                        <Trash2 size={16} /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
                        <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                            <X size={24} />
                        </button>
                        <h2 style={{ marginBottom: '1.5rem' }}>{editingId ? 'Edit Turf' : 'Add New Turf'}</h2>
                        
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Venue Name</label>
                                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="input" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>City/Location</label>
                                    <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required className="input" />
                                </div>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Full Address</label>
                                <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required className="input" />
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Description</label>
                                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="input" rows="3" />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Contact Name</label>
                                    <input type="text" value={formData.contactName} onChange={e => setFormData({...formData, contactName: e.target.value})} className="input" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Contact Number</label>
                                    <input type="text" value={formData.contactNumber} onChange={e => setFormData({...formData, contactNumber: e.target.value})} className="input" />
                                </div>
                            </div>

                            <div style={{ marginBottom: '2rem', background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <h3 style={{ fontSize: '1rem' }}>Sports & Pricing (Courts)</h3>
                                    <button type="button" onClick={handleAddSport} className="btn" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}>+ Add Sport</button>
                                </div>
                                
                                {formData.sports.map((sport, index) => (
                                    <div key={index} style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                                        <input 
                                            type="text" 
                                            placeholder="Sport (e.g. Cricket)" 
                                            value={sport.type} 
                                            onChange={e => handleSportChange(index, 'type', e.target.value)} 
                                            required 
                                            className="input" 
                                        />
                                        <input 
                                            type="number" 
                                            placeholder="Price/Hr (₹)" 
                                            value={sport.price || ''} 
                                            onChange={e => handleSportChange(index, 'price', e.target.value)} 
                                            required 
                                            className="input" 
                                            style={{ width: '120px' }}
                                        />
                                        {formData.sports.length > 1 && (
                                            <button type="button" onClick={() => handleRemoveSport(index)} style={{ background: 'transparent', color: 'red', border: 'none', cursor: 'pointer' }}>
                                                <X size={20} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline">Cancel</button>
                                <button type="submit" disabled={loadingSubmit} className="btn btn-primary">{loadingSubmit ? 'Saving...' : 'Save Turf'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
