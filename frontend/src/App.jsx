import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useState, useEffect } from 'react';

Amplify.configure({
  Auth: {
    region: 'us-east-1',
    userPoolId: 'us-east-1_lQIBdQwp8',
    userPoolWebClientId: '52lalfrfdu5k90vcq58qtkk0en',
    mandatorySignIn: false,
  }
});

const API_URL = 'https://8ozozykocg.execute-api.us-east-1.amazonaws.com/dev';

function WorkshopsList({ token, isAdmin }) {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', description: '', category: '', location: '', startAt: '', endAt: '', capacity: ''
  });

  const loadWorkshops = async () => {
    try {
      const response = await fetch(`${API_URL}/workshops`);
      const data = await response.json();
      setWorkshops(data.workshops || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createWorkshop = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/workshops`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        alert('Taller creado');
        setShowForm(false);
        setFormData({ name: '', description: '', category: '', location: '', startAt: '', endAt: '', capacity: '' });
        loadWorkshops();
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  useEffect(() => { loadWorkshops(); }, []);

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-4">
        <h1>📚 Talleres</h1>
        {isAdmin && <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancelar' : '+ Crear'}</button>}
      </div>
      {showForm && isAdmin && (
        <form onSubmit={createWorkshop} className="card mb-4 p-3">
          <div className="row">
            <div className="col-md-6 mb-2"><input type="text" className="form-control" placeholder="Nombre" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
            <div className="col-md-6 mb-2"><input type="text" className="form-control" placeholder="Categoría" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} /></div>
            <div className="col-12 mb-2"><textarea className="form-control" placeholder="Descripción" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
            <div className="col-md-6 mb-2"><input type="text" className="form-control" placeholder="Ubicación" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} /></div>
            <div className="col-md-3 mb-2"><input type="datetime-local" className="form-control" required value={formData.startAt} onChange={e => setFormData({...formData, startAt: e.target.value})} /></div>
            <div className="col-md-3 mb-2"><input type="datetime-local" className="form-control" required value={formData.endAt} onChange={e => setFormData({...formData, endAt: e.target.value})} /></div>
            <div className="col-md-3 mb-2"><input type="number" className="form-control" placeholder="Capacidad" required value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} /></div>
            <div className="col-12"><button type="submit" className="btn btn-success">Guardar</button></div>
          </div>
        </form>
      )}
      <div className="row">
        {workshops.length === 0 ? <div>No hay talleres</div> : workshops.map((w, i) => (
          <div className="col-md-4 mb-3" key={i}>
            <div className="card">
              <div className="card-body">
                <h5>{w.name}</h5>
                <span className="badge bg-secondary">{w.category}</span>
                <p>{w.description}</p>
                <small>📍 {w.location}<br/>📅 {new Date(w.startAt).toLocaleString()}<br/>👥 Capacidad: {w.capacity}</small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [token, setToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <Authenticator>
      {({ signOut, user }) => {
        const getToken = async () => {
          const session = await Amplify.Auth.currentSession();
          const idToken = session.getIdToken().getJwtToken();
          setToken(idToken);
          const groups = session.getIdToken().payload['cognito:groups'] || [];
          setIsAdmin(groups.includes('admin') || user.attributes.email === 'admin@ejemplo.com');
        };
        getToken();
        return (
          <div>
            <nav className="navbar navbar-dark bg-dark">
              <div className="container">
                <span className="navbar-brand">🎓 Workshops</span>
                <div><span className="navbar-text me-2">{user.attributes.email} {isAdmin && '(Admin)'}</span>
                <button className="btn btn-outline-light btn-sm" onClick={signOut}>Salir</button></div>
              </div>
            </nav>
            <WorkshopsList token={token} isAdmin={isAdmin} />
          </div>
        );
      }}
    </Authenticator>
  );
}

export default App;
