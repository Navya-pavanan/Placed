'use client';
import React, { Suspense } from 'react';
import ClassesModule from '../../src/components/student/ClassesModule';

export default function ClassesPage() {
  return (
    <Suspense fallback={<div style={{ padding: '32px', color: '#64748B' }}>Loading Classes...</div>}>
      <ClassesModule />
    </Suspense>
  );
}
