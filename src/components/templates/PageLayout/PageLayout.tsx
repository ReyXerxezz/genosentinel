import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

export const PageLayout: React.FC = () => {
	const { pathname } = useLocation();
	const isLogin = pathname === '/' || pathname === '/login';

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center px-4">
			<div className="max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-10 items-center">
				<div className="space-y-4">
					<Link
						to="/"
						className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold"
					>
						🛡️ Genosentinel
					</Link>
					<h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
						Accede para gestionar <span className="text-blue-700">clínica</span> y <span className="text-indigo-700">genómica</span>
					</h1>
					<p className="text-gray-600 max-w-xl">
						Centraliza pacientes, registros clínicos y tipos de tumor en un solo lugar, con acceso seguro a través del gateway.
					</p>
					<div className="flex gap-3 text-sm text-gray-600" />
				</div>

				<div className="bg-white border border-gray-200 shadow-xl rounded-2xl p-8 w-full max-w-md mx-auto">
					<div className="flex items-center justify-between mb-6">
						<div>
							<p className="text-sm text-gray-500">Acceso</p>
							<h2 className="text-xl font-semibold text-gray-900">
								{isLogin ? 'Inicia sesión' : 'Crea tu cuenta'}
							</h2>
						</div>
						<Link
							to={isLogin ? '/register' : '/'}
							className="text-sm font-medium text-blue-700 hover:text-blue-900"
						>
							{isLogin ? 'Crear cuenta' : 'Ya tengo cuenta'}
						</Link>
					</div>
					<Outlet />
				</div>
			</div>
		</div>
	);
};
