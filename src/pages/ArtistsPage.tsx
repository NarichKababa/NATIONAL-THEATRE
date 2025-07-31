import React from 'react';
import { Star, Award, Calendar, MapPin } from 'lucide-react';

interface Artist {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  achievements: string[];
  experience: string;
  location: string;
  rating: number;
  totalShows: number;
}

export default function ArtistsPage() {
  const artists: Artist[] = [
    {
      id: '1',
      name: 'Sarah Nakimuli',
      role: 'Lead Actress & Director',
      bio: 'Sarah is a celebrated actress and director with over 15 years of experience in Ugandan theatre. She has been instrumental in preserving traditional Ugandan storytelling while incorporating modern theatrical techniques.',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
      achievements: ['Best Actress Award 2023', 'Cultural Ambassador', 'Theatre Director of the Year'],
      experience: '15+ years',
      location: 'Kampala, Uganda',
      rating: 4.9,
      totalShows: 85
    },
    {
      id: '2',
      name: 'David Mukasa',
      role: 'Musical Director & Composer',
      bio: 'David is a talented musician and composer who blends traditional Ugandan music with contemporary sounds. His compositions have become synonymous with Uganda National Theatre productions.',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
      achievements: ['Best Original Score 2024', 'Traditional Music Preservation Award', 'Grammy Nomination'],
      experience: '12+ years',
      location: 'Kampala, Uganda',
      rating: 4.8,
      totalShows: 67
    },
    {
      id: '3',
      name: 'Grace Namatovu',
      role: 'Choreographer & Dance Director',
      bio: 'Grace is a master of traditional Ugandan dance forms and has choreographed numerous award-winning productions. She leads our dance troupe and teaches traditional dance to young artists.',
      image: 'https://images.pexels.com/photos/1121796/pexels-photo-1121796.jpeg',
      achievements: ['Choreographer of the Year', 'Cultural Heritage Award', 'International Dance Festival Winner'],
      experience: '18+ years',
      location: 'Kampala, Uganda',
      rating: 4.9,
      totalShows: 92
    },
    {
      id: '4',
      name: 'Michael Ssemakula',
      role: 'Actor & Voice Coach',
      bio: 'Michael is known for his powerful stage presence and distinctive voice. He has starred in numerous productions and now mentors the next generation of Ugandan actors.',
      image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg',
      achievements: ['Best Supporting Actor', 'Voice Excellence Award', 'Theatre Mentor Award'],
      experience: '10+ years',
      location: 'Kampala, Uganda',
      rating: 4.7,
      totalShows: 54
    },
    {
      id: '5',
      name: 'Ruth Kisakye',
      role: 'Costume Designer & Cultural Consultant',
      bio: 'Ruth specializes in creating authentic traditional costumes and ensuring cultural accuracy in all productions. Her designs have been featured in international theatre festivals.',
      image: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg',
      achievements: ['Best Costume Design', 'Cultural Authenticity Award', 'International Design Recognition'],
      experience: '14+ years',
      location: 'Kampala, Uganda',
      rating: 4.8,
      totalShows: 78
    },
    {
      id: '6',
      name: 'James Kiwanuka',
      role: 'Set Designer & Technical Director',
      bio: 'James brings stories to life through innovative set designs that blend traditional Ugandan aesthetics with modern theatrical technology. His work has transformed the theatre experience.',
      image: 'https://images.pexels.com/photos/1374510/pexels-photo-1374510.jpeg',
      achievements: ['Best Set Design Award', 'Technical Innovation Prize', 'Sustainability in Theatre Award'],
      experience: '11+ years',
      location: 'Kampala, Uganda',
      rating: 4.6,
      totalShows: 43
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Artists</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the talented individuals who bring our stories to life. Our diverse team of artists represents the rich cultural heritage and creative spirit of Uganda.
          </p>
        </div>

        {/* Artists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artists.map((artist) => (
            <div key={artist.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className="relative">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-3 py-1 rounded-full">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className="text-sm font-semibold">{artist.rating}</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{artist.name}</h3>
                <p className="text-amber-600 font-semibold mb-3">{artist.role}</p>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{artist.bio}</p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{artist.experience}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{artist.location}</span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-600">{artist.totalShows}</div>
                    <div className="text-xs text-gray-600">Total Performances</div>
                  </div>
                </div>

                {/* Achievements */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <Award className="h-4 w-4 mr-2 text-amber-500" />
                    Key Achievements
                  </h4>
                  <div className="space-y-1">
                    {artist.achievements.slice(0, 2).map((achievement, index) => (
                      <div key={index} className="text-xs bg-amber-50 text-amber-800 px-2 py-1 rounded">
                        {achievement}
                      </div>
                    ))}
                    {artist.achievements.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{artist.achievements.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Join Our Artistic Community</h2>
          <p className="text-xl mb-6 max-w-2xl mx-auto">
            Are you a talented artist looking to be part of Uganda's premier theatre company? We're always looking for passionate performers, musicians, and creative professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-amber-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all">
              View Auditions
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-amber-600 transition-all">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}