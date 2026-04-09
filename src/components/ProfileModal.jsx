import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasks } from '../context/TaskContext';

export default function ProfileModal() {
  const { user, setUser, addNotification } = useTasks();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', avatar: null });

  // Listen for the custom event from Header
  useEffect(() => {
    const handleOpen = () => {
      setFormData({ name: user.name, email: user.email, avatar: user.avatar });
      setIsOpen(true);
    };
    window.addEventListener('open-profile-modal', handleOpen);
    return () => window.removeEventListener('open-profile-modal', handleOpen);
  }, [user]);

  function handleSave(e) {
    e.preventDefault();
    setUser(prev => ({ ...prev, ...formData }));
    addNotification('Profile updated successfully!', 'success');
    setIsOpen(false);
  }

  function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="modal profile-edit-modal"
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2 className="modal-title">Edit Profile</h2>
              <button className="icon-btn" onClick={() => setIsOpen(false)}>
                <span className="material-icons-round">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="profile-upload-section">
                  <div className="profile-large-avatar edit-mode" style={{ backgroundImage: formData.avatar ? `url(${formData.avatar})` : 'none' }}>
                    {!formData.avatar && formData.name.charAt(0)}
                    <label className="avatar-upload-overlay">
                      <span className="material-icons-round">photo_camera</span>
                      <input type="file" onChange={handleAvatarChange} style={{ display:'none' }} accept="image/*" />
                    </label>
                  </div>
                  <p className="upload-hint">Click photo icon to change avatar</p>
                </div>

                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input 
                    className="form-input" 
                    value={formData.name} 
                    onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input 
                    className="form-input" 
                    type="email"
                    value={formData.email} 
                    onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setIsOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
