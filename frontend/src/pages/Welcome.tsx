import React, { useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { useJoke } from '../hooks/useJoke';

const Welcome: React.FC = () => {
  const { joke, showPunchline, setShowPunchline, fetchJoke } = useJoke();

  useEffect(() => {
    fetchJoke();
  }, []);

  return (
    <Card className="w-full h-full flex align-items-center justify-content-center">
      <div className="flex flex-column align-items-center gap-4">
        {joke && (
          <>
            <div className="text-2xl text-center">{joke.setup}</div>
            {showPunchline && (
              <div className="text-xl text-center font-italic text-primary">
                {joke.punchline}
              </div>
            )}
            <div className="flex gap-2">
              {!showPunchline && (
                <Button 
                  label="I don't know" 
                  onClick={() => setShowPunchline(true)}
                  className="p-button-rounded"
                  style={{ background: 'linear-gradient(90deg, #e14a53 1.81%, #ffa246 100%)', border: 'none' }}
                />
              )}
              <Button 
                label="This was not so funny!" 
                onClick={fetchJoke}
                className="p-button-rounded"
                style={{ background: 'linear-gradient(90deg, #e14a53 1.81%, #ffa246 100%)', border: 'none' }}
              />
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default Welcome;
