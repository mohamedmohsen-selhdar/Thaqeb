import React, { useState } from 'react';
import { useConversation } from '@elevenlabs/react';
import { Mic, MicOff, Loader2, Maximize2, Minimize2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/i18n/LanguageContext';

export const VoiceAgentWidget = () => {
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [hasError, setHasError] = useState(false);

    const conversation = useConversation({
        onConnect: () => {
            console.log('ElevenLabs Agent Connected');
            setHasError(false);
            setIsOpen(true);
        },
        onDisconnect: () => {
            console.log('ElevenLabs Agent Disconnected');
            setIsOpen(false);
        },
        onMessage: (message) => console.log('Message:', message),
        onError: (error) => {
            console.error('ElevenLabs Error:', error);
            setHasError(true);
        },
    });

    const startConversation = async () => {
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
            await conversation.startSession({
                agentId: 'agent_4301khzyka9cf1nt7f87g1p91v1a',
                connectionType: 'webrtc', // Recommended for lower latency
            });
        } catch (error) {
            console.error('Failed to start conversation:', error);
            setHasError(true);
        }
    };

    const stopConversation = async () => {
        await conversation.endSession();
    };

    const isConnected = conversation.status === 'connected';
    const isConnecting = conversation.status === 'connecting';

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
            {/* Active Conversation Panel */}
            {isOpen && (
                <div className="bg-card border border-primary/30 rounded-2xl p-4 w-72 shadow-glow-strong animate-slide-up flex flex-col gap-4 relative overflow-hidden backdrop-blur-md">
                    {/* subtle background glow based on speaking state */}
                    <div
                        className={`absolute inset-0 bg-primary/5 transition-opacity duration-500 ${conversation.isSpeaking ? 'opacity-100' : 'opacity-0'}`}
                    />

                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <h4 className="font-display font-semibold text-foreground flex items-center gap-2">
                                <div className="relative flex h-3 w-3">
                                    {isConnected && (
                                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 ${conversation.isSpeaking ? 'bg-green-500' : ''}`}></span>
                                    )}
                                    <span className={`relative inline-flex rounded-full h-3 w-3 ${isConnected ? (conversation.isSpeaking ? 'bg-green-500' : 'bg-primary') : 'bg-muted'}`}></span>
                                </div>
                                Support Comm
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">
                                {isConnecting ? 'Establishing secure link...' : (conversation.isSpeaking ? 'Agent is transmitting' : 'Agent is listening')}
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-full hover:bg-white/10"
                            onClick={() => setIsOpen(false)}
                        >
                            <Minimize2 className="h-3 w-3" />
                        </Button>
                    </div>

                    <div className="flex justify-center py-4 relative z-10">
                        {/* Visualizer placeholder / Avatar */}
                        <div className={`w-16 h-16 rounded-full border-2 border-primary/50 flex items-center justify-center transition-all duration-300 ${conversation.isSpeaking ? 'scale-110 shadow-glow bg-primary/20' : 'scale-100 bg-surface-elevated'}`}>
                            <div className={`w-8 h-8 rounded-full ${conversation.isSpeaking ? 'bg-primary' : 'bg-primary/50'} transition-colors duration-300`} />
                        </div>
                    </div>

                    <Button
                        variant="destructive"
                        className="w-full relative z-10"
                        onClick={stopConversation}
                    >
                        Terminate Link
                    </Button>
                </div>
            )}

            {/* Floating Action Button */}
            {!isOpen && (
                <Button
                    onClick={isConnected ? () => setIsOpen(true) : startConversation}
                    size="lg"
                    className="h-14 w-14 rounded-full shadow-glow flex items-center justify-center relative group bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={isConnecting}
                >
                    {isConnecting ? (
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    ) : isConnected ? (
                        <Maximize2 className="h-6 w-6" />
                    ) : (
                        <Mic className="h-6 w-6 transition-colors" />
                    )}

                    {/* Pulse effect when waiting to connect */}
                    {!isConnected && !isConnecting && (
                        <span className="absolute -inset-1 rounded-full border border-primary/30 animate-ping group-hover:border-primary/60" style={{ animationDuration: '3s' }} />
                    )}
                </Button>
            )}

            {/* Error Toast Fallback */}
            {hasError && !isOpen && (
                <div className="absolute bottom-20 right-0 bg-destructive/10 border border-destructive/50 text-destructive text-xs px-3 py-2 rounded-md whitespace-nowrap animate-slide-up flex justify-between items-center gap-4 backdrop-blur-sm">
                    <span>Audio subsystem failure. Check permissions.</span>
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setHasError(false)} />
                </div>
            )}
        </div>
    );
};
