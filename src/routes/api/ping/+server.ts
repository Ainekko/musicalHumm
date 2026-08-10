import { json } from '@sveltejs/kit';


// just to keep the server alive and a deployment on vercels

export async function GET() {
  try {
    const res = await fetch('https://mhr-sms-xi2w.onrender.com/health');
    const data = await res.json();
    return json({ success: true, backendStatus: data.status });
  } catch (error: any) {
    console.error('Failed to ping backend:', error);
    return json({ success: false, error: error.message }, { status: 500 });
  }
}
