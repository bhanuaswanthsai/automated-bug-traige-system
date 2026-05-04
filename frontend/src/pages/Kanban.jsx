import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import api from '../api/axios';
import { Bug as BugIcon } from 'lucide-react';

const Kanban = () => {
  const [columns, setColumns] = useState({
    Open: [],
    'In Progress': [],
    Resolved: [],
    Closed: []
  });

  useEffect(() => {
    fetchBugs();
  }, []);

  const fetchBugs = async () => {
    try {
      const res = await api.get('/bugs');
      const cols = { Open: [], 'In Progress': [], Resolved: [], Closed: [] };
      res.data.forEach(bug => {
        if (cols[bug.status]) {
          cols[bug.status].push(bug);
        }
      });
      setColumns(cols);
    } catch (err) {
      console.error(err);
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceCol = [...columns[source.droppableId]];
      const destCol = [...columns[destination.droppableId]];
      const [removed] = sourceCol.splice(source.index, 1);
      
      // Update local state
      removed.status = destination.droppableId;
      destCol.splice(destination.index, 0, removed);
      
      setColumns({
        ...columns,
        [source.droppableId]: sourceCol,
        [destination.droppableId]: destCol
      });

      // Update backend
      try {
        await api.put(`/bugs/${removed._id}`, { status: destination.droppableId });
      } catch (err) {
        console.error(err);
        fetchBugs(); // Revert on failure
      }
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">Kanban Board</h1>
        <p className="text-[var(--text-muted)]">Drag and drop to update bug status</p>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 min-w-max h-full">
            {Object.entries(columns).map(([colId, items]) => (
              <div key={colId} className="w-80 flex flex-col bg-[var(--surface)] border border-gray-100 dark:border-slate-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-slate-800 bg-[var(--background)] flex justify-between items-center">
                  <h3 className="font-semibold text-[var(--text)]">{colId}</h3>
                  <span className="text-xs bg-gray-200 dark:bg-slate-700 text-[var(--text-muted)] px-2 py-1 rounded-full">
                    {items.length}
                  </span>
                </div>
                
                <Droppable droppableId={colId}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`flex-1 p-4 space-y-4 overflow-y-auto ${snapshot.isDraggingOver ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}
                    >
                      {items.map((item, index) => (
                        <Draggable key={item._id} draggableId={item._id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-4 rounded-lg border shadow-sm transition-shadow ${
                                snapshot.isDragging 
                                  ? 'bg-[var(--surface)] border-indigo-500 shadow-lg scale-105' 
                                  : 'bg-[var(--surface)] border-gray-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700'
                              }`}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <span className={`text-xs px-2 py-0.5 rounded-sm font-medium ${
                                  item.priority === 'P1' ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400' :
                                  'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400'
                                }`}>
                                  {item.priority}
                                </span>
                                <BugIcon size={14} className="text-[var(--text-muted)]" />
                              </div>
                              <p className="text-sm font-medium text-[var(--text)] mb-3 line-clamp-2">{item.title}</p>
                              <div className="flex items-center justify-between mt-auto">
                                <span className="text-xs text-[var(--text-muted)] bg-[var(--background)] px-2 py-1 rounded-full">
                                  {item.category}
                                </span>
                                {item.assignedTo && (
                                  <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-xs text-indigo-600 dark:text-indigo-400 font-bold" title={item.assignedTo.name}>
                                    {item.assignedTo.name.charAt(0)}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default Kanban;
